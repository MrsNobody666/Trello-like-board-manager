"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getIntegrations() {
    try {
        const integrations = await db.integration.findMany();
        return integrations;
    } catch (error) {
        return [];
    }
}

export async function toggleIntegration(type: string, enabled: boolean) {
    try {
        await db.integration.upsert({
            where: { id: type }, // Using type as ID for simplicity in this demo
            update: { enabled },
            create: { id: type, type, name: type.charAt(0).toUpperCase() + type.slice(1), enabled }
        });
        revalidatePath("/settings");
    } catch (error) {
        console.error("Failed to toggle integration", error);
    }
}

export async function syncGmail() {
    try {
        // Simulated Gmail/Calendar items
        const mockItems = [
            {
                externalId: "evt_001",
                source: "GMAIL",
                title: "Product Sync: Design Review",
                description: "Discuss the new glassmorphism theme components with the design team.",
                metadata: JSON.stringify({ type: "EVENT", time: "2026-01-17T10:00:00Z" })
            },
            {
                externalId: "msg_102",
                source: "GMAIL",
                title: "Action Required: Database Migration",
                description: "Review and approve the latest schema changes for the Power-Ups feature.",
                metadata: JSON.stringify({ type: "EMAIL", sender: "devops@taskmaster.ai" })
            },
            {
                externalId: "evt_003",
                source: "GMAIL",
                title: "Quarterly Planner Session",
                description: "Strategic planning for Q1 2026. Refresh the roadmap boards.",
                metadata: JSON.stringify({ type: "EVENT", time: "2026-01-18T14:00:00Z" })
            }
        ];

        for (const item of mockItems) {
            await db.externalItem.upsert({
                where: { externalId: item.externalId },
                update: {},
                create: { ...item }
            });
        }

        await db.integration.updateMany({
            where: { type: "GMAIL" },
            data: { lastSyncedAt: new Date() }
        });

        revalidatePath("/settings");
        return { success: true, count: mockItems.length };
    } catch (error) {
        console.error("Gmail sync failed", error);
        return { success: false };
    }
}

export async function getDiscoveredItems() {
    try {
        return await db.externalItem.findMany({
            where: { status: "PENDING" },
            orderBy: { createdAt: "desc" }
        });
    } catch (error) {
        return [];
    }
}

export async function convertToCard(externalItemId: string, boardId: string, listId: string) {
    try {
        const item = await db.externalItem.findUnique({
            where: { id: externalItemId }
        });

        if (!item) throw new Error("Item not found");

        const lastCard = await db.card.findFirst({
            where: { listId },
            orderBy: { position: "desc" } as any
        });

        const newOrder = lastCard ? (lastCard as any).position + 1 : 1;

        const card = await db.card.create({
            data: {
                title: item.title,
                description: item.description,
                listId,
                position: newOrder
            } as any
        });

        await db.externalItem.update({
            where: { id: externalItemId },
            data: { status: "SYNCED", cardId: card.id }
        });

        revalidatePath(`/board/${boardId}`);
        revalidatePath("/settings");
        return { success: true };
    } catch (error) {
        console.error("Conversion failed", error);
        return { success: false };
    }
}
