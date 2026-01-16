"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { logActivity, ActivityAction } from "@/lib/activity";

// Placeholder for current user resolution
async function getCurrentUser() {
    const member = await db.member.findFirst();
    return member?.id || "anonymous-unit";
}

export async function updateCard(cardId: string, boardId: string, data: any) {
    const userId = await getCurrentUser();

    await db.card.update({
        where: { id: cardId },
        data,
    });

    // Log Activity (Simplified for general update)
    await logActivity({
        boardId,
        userId,
        action: ActivityAction.CARD_UPDATED,
        entityType: "CARD",
        entityId: cardId,
        cardId,
        details: { fields: Object.keys(data) }
    });

    revalidatePath(`/board/${boardId}`);
}

export async function addCardLabel(cardId: string, boardId: string, labelId: string) {
    const userId = await getCurrentUser();

    await db.cardLabel.create({
        data: { cardId, labelId },
    });

    await logActivity({
        boardId,
        userId,
        action: ActivityAction.LABEL_ADDED,
        entityType: "CARD",
        entityId: cardId,
        cardId,
        details: { labelId }
    });

    revalidatePath(`/board/${boardId}`);
}

export async function removeCardLabel(cardId: string, boardId: string, labelId: string) {
    const userId = await getCurrentUser();

    await db.cardLabel.delete({
        where: {
            cardId_labelId: {
                cardId,
                labelId,
            },
        },
    });

    await logActivity({
        boardId,
        userId,
        action: ActivityAction.LABEL_REMOVED,
        entityType: "CARD",
        entityId: cardId,
        cardId,
        details: { labelId }
    });

    revalidatePath(`/board/${boardId}`);
}

export async function createChecklist(cardId: string, boardId: string, title: string) {
    const userId = await getCurrentUser();

    const checklist = await db.checklist.create({
        data: { cardId, title },
    });

    await logActivity({
        boardId,
        userId,
        action: ActivityAction.CARD_UPDATED,
        entityType: "CARD",
        entityId: cardId,
        cardId,
        details: { action: "CHECKLIST_CREATED", checklistId: checklist.id }
    });

    revalidatePath(`/board/${boardId}`);
}

export async function createCheckitem(checklistId: string, boardId: string, title: string) {
    await db.checklistItem.create({
        data: { checklistId, title },
    });
    revalidatePath(`/board/${boardId}`);
}

export async function updateCheckitem(itemId: string, boardId: string, data: { isChecked?: boolean; title?: string; dueDate?: Date | null }) {
    await db.checklistItem.update({
        where: { id: itemId },
        data,
    });
    revalidatePath(`/board/${boardId}`);
}

export async function deleteCard(cardId: string, boardId: string) {
    const userId = await getCurrentUser();

    await db.card.delete({
        where: { id: cardId }
    });

    await logActivity({
        boardId,
        userId,
        action: ActivityAction.CARD_DELETED,
        entityType: "CARD",
        entityId: cardId,
        details: { cardId }
    });

    revalidatePath(`/board/${boardId}`);
}

export async function deleteChecklist(checklistId: string, boardId: string) {
    await db.checklist.delete({
        where: { id: checklistId }
    });
    revalidatePath(`/board/${boardId}`);
}

export async function archiveCard(cardId: string, boardId: string, isArchived: boolean = true) {
    const userId = await getCurrentUser();

    await db.card.update({
        where: { id: cardId },
        data: { isArchived },
    });

    await logActivity({
        boardId,
        userId,
        action: isArchived ? ActivityAction.CARD_ARCHIVED : ActivityAction.CARD_UPDATED,
        entityType: "CARD",
        entityId: cardId,
        cardId,
        details: { isArchived }
    });

    revalidatePath(`/board/${boardId}`);
}

export async function archiveList(listId: string, boardId: string, isArchived: boolean = true) {
    const userId = await getCurrentUser();

    await db.list.update({
        where: { id: listId },
        data: { isArchived },
    });

    await logActivity({
        boardId,
        userId,
        action: isArchived ? ActivityAction.LIST_ARCHIVED : ActivityAction.LIST_MOVED, // Simplified
        entityType: "LIST",
        entityId: listId,
        details: { isArchived }
    });

    revalidatePath(`/board/${boardId}`);
}

export async function updateCustomFieldValue(cardId: string, boardId: string, fieldId: string, value: string) {
    const userId = await getCurrentUser();

    await db.customFieldValue.upsert({
        where: {
            cardId_fieldId: {
                cardId,
                fieldId,
            },
        },
        update: { value },
        create: { cardId, fieldId, value },
    });

    await logActivity({
        boardId,
        userId,
        action: ActivityAction.CARD_UPDATED,
        entityType: "CARD",
        entityId: cardId,
        cardId,
        details: { action: "CUSTOM_FIELD_UPDATED", fieldId, value }
    });

    revalidatePath(`/board/${boardId}`);
}
