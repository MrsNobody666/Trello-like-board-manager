"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addComment(cardId: string, boardId: string, text: string) {
    try {
        await db.comment.create({
            data: {
                cardId,
                text,
            },
        });

        // Create activity log - DISABLED TEMPORARILY due to missing context
        /*
        await db.activity.create({
            data: {
                cardId,
                action: "commented",
                details: JSON.stringify({ text: text.substring(0, 100) }),
            },
        });
        */

        revalidatePath(`/board/${boardId}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to add comment" };
    }
}

export async function logActivity(cardId: string, action: string, details?: any) {
    try {
        /*
        await db.activity.create({
            data: {
                cardId,
                action,
                details: details ? JSON.stringify(details) : null,
            },
        });
        */
        return { success: true };
    } catch (error) {
        console.error("Failed to log activity:", error);
        return { error: "Failed to log activity" };
    }
}
