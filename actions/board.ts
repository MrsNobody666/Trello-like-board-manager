"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { AutomationEngine } from "@/lib/automation";
import { seedAutomationRules } from "./automation";
import { logActivity, ActivityAction } from "@/lib/activity";

// Placeholder for current user resolution (in real app, this would be from session/auth)
async function getCurrentUser() {
    const member = await db.member.findFirst();
    return member?.id || "anonymous-unit";
}

export async function createBoard(title: string, workspaceId?: string) {
    try {
        const userId = await getCurrentUser();

        // 1. Resolve Workspace
        let targetWorkspaceId = workspaceId;
        if (!targetWorkspaceId) {
            const workspace = await db.workspace.findFirst();
            if (!workspace) {
                // Create a default workspace if none exists (fallback for first run)
                const newWorkspace = await db.workspace.create({
                    data: { name: "Default Workspace", description: "Auto-created workspace" }
                });
                targetWorkspaceId = newWorkspace.id;
            } else {
                targetWorkspaceId = workspace.id;
            }
        }

        // 2. Create the board
        const board = await db.board.create({
            data: {
                title,
                workspaceId: targetWorkspaceId!,
            },
        });

        // 3. Create default lists
        await db.list.createMany({
            data: [
                { title: "To Do", boardId: board.id, position: 1 },
                { title: "Doing", boardId: board.id, position: 2 },
                { title: "Done", boardId: board.id, position: 3 },
            ] as any
        });

        // 4. Seed default automation rules
        await seedAutomationRules(board.id);

        // 5. Log Activity
        await logActivity({
            boardId: board.id,
            userId,
            action: ActivityAction.LIST_CREATED,
            entityType: "BOARD",
            entityId: board.id,
            details: { title }
        });

        revalidatePath("/");
        return { success: true, boardId: board.id };
    } catch (error) {
        console.error("Failed to create board:", error);
        return { error: "Failed to create board" };
    }
}

export async function createCard(listId: string, boardId: string, title: string) {
    try {
        const userId = await getCurrentUser();

        const lastCard = await db.card.findFirst({
            where: { listId },
            orderBy: { position: "desc" } as any,
            select: { position: true } as any,
        });

        const newPosition = lastCard ? (lastCard as any).position + 1 : 1;

        const card = await db.card.create({
            data: {
                title,
                listId,
                position: newPosition,
                description: "",
            } as any,
        });

        // Log Activity
        await logActivity({
            boardId,
            userId,
            action: ActivityAction.CARD_CREATED,
            entityType: "CARD",
            entityId: card.id,
            cardId: card.id,
            details: { title, listId }
        });

        // Fetch list title for automation context
        const list = await db.list.findUnique({ where: { id: listId } });

        // Trigger automation
        await AutomationEngine.processTrigger("card_created", card.id, {
            listId,
            boardId,
            listTitle: list?.title
        });

        revalidatePath(`/board/${boardId}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to create card" };
    }
}

export async function createList(boardId: string, title: string) {
    try {
        const userId = await getCurrentUser();

        const lastList = await db.list.findFirst({
            where: { boardId },
            orderBy: { position: "desc" } as any,
            select: { position: true } as any,
        });

        const newPosition = lastList ? (lastList as any).position + 1 : 1;

        const list = await db.list.create({
            data: {
                title,
                boardId,
                position: newPosition,
            } as any,
        });

        // Log Activity
        await logActivity({
            boardId,
            userId,
            action: ActivityAction.LIST_CREATED,
            entityType: "LIST",
            entityId: list.id,
            details: { title }
        });

        revalidatePath(`/board/${boardId}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to create list" };
    }
}

export async function updateList(listId: string, boardId: string, title: string) {
    try {
        await db.list.update({
            where: { id: listId },
            data: { title },
        });

        revalidatePath(`/board/${boardId}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to update list" };
    }
}

export async function copyList(listId: string, boardId: string) {
    try {
        const userId = await getCurrentUser();

        // 1. Fetch source list with cards
        const listToCopy = await db.list.findUnique({
            where: { id: listId },
            include: { cards: true },
        });

        if (!listToCopy) return { error: "List not found" };

        // 2. Get last position
        const lastList = await db.list.findFirst({
            where: { boardId },
            orderBy: { position: "desc" } as any,
            select: { position: true } as any,
        });
        const newPosition = lastList ? (lastList as any).position + 1 : 1;

        // 3. Create new list
        const newList = await db.list.create({
            data: {
                boardId: listToCopy.boardId,
                title: `${listToCopy.title} - Copy`,
                position: newPosition,
            } as any,
        });

        // 4. Copy cards
        if (listToCopy.cards.length > 0) {
            await db.card.createMany({
                data: listToCopy.cards.map((card) => ({
                    title: card.title,
                    description: card.description,
                    position: (card as any).position,
                    listId: newList.id,
                })) as any,
            });
        }

        // Log Activity
        await logActivity({
            boardId,
            userId,
            action: ActivityAction.LIST_CREATED,
            entityType: "LIST",
            entityId: newList.id,
            details: { title: newList.title, sourceId: listId }
        });

        revalidatePath(`/board/${boardId}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to copy list" };
    }
}

export async function updateListOrder(boardId: string, items: { id: string; position: number }[]) {
    try {
        const userId = await getCurrentUser();

        const transaction = items.map((list) =>
            db.list.update({
                where: { id: list.id },
                data: { position: list.position } as any,
            })
        );

        await db.$transaction(transaction);

        // Log Activity
        await logActivity({
            boardId,
            userId,
            action: ActivityAction.LIST_MOVED,
            entityType: "LIST",
            entityId: boardId, // Board context for reordering
            details: { items }
        });

        revalidatePath(`/board/${boardId}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to reorder lists" };
    }
}

export async function updateCardOrder(boardId: string, items: { id: string; position: number; listId: string }[]) {
    try {
        const userId = await getCurrentUser();

        // Fetch current state of cards in this update to find which one moved lists
        const cardIds = items.map(i => i.id);
        const currentCards = await db.card.findMany({
            where: { id: { in: cardIds } },
            select: { id: true, listId: true, title: true }
        });

        const transaction = items.map((card) =>
            db.card.update({
                where: { id: card.id },
                data: {
                    position: card.position,
                    listId: card.listId,
                } as any,
            })
        );

        await db.$transaction(transaction);

        // Find and trigger automation / activity for cards that changed lists
        for (const item of items) {
            const currentCard = currentCards.find(c => c.id === item.id);
            if (currentCard && currentCard.listId !== item.listId) {
                // Log Activity
                await logActivity({
                    boardId,
                    userId,
                    action: ActivityAction.CARD_MOVED,
                    entityType: "CARD",
                    entityId: item.id,
                    cardId: item.id,
                    details: {
                        fromListId: currentCard.listId,
                        toListId: item.listId,
                        title: currentCard.title
                    }
                });

                // Fetch target list title
                const targetList = await db.list.findUnique({ where: { id: item.listId } });

                await AutomationEngine.processTrigger("card_moved", item.id, {
                    listId: item.listId,
                    boardId,
                    previousListId: currentCard.listId,
                    listTitle: targetList?.title
                });
            }
        }

        revalidatePath(`/board/${boardId}`);
        return { success: true };
    } catch (error) {
        console.error("Update card order failed:", error);
        return { error: "Failed to reorder cards" };
    }
}

export async function deleteList(listId: string, boardId: string) {
    try {
        await db.list.delete({
            where: { id: listId },
        });

        revalidatePath(`/board/${boardId}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete list" };
    }
}

export async function getBoards() {
    try {
        const boards = await db.board.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });
        return boards;
    } catch (error) {
        return [];
    }
}
