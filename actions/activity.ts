"use server";

import { db } from "@/lib/db";

export async function getBoardActivities(boardId: string) {
    try {
        const activities = await (db as any).activity.findMany({
            where: { boardId },
            include: {
                user: true,
                card: {
                    select: {
                        title: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 50
        });

        return activities;
    } catch (error) {
        console.error("Failed to fetch board activities:", error);
        return [];
    }
}
