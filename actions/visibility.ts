"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateBoardVisibility(boardId: string, visibility: string) {
    try {
        await (db as any).board.update({
            where: { id: boardId },
            data: { visibility }
        });
        revalidatePath(`/board/${boardId}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to update board visibility:", error);
        return { error: "Failed to update visibility" };
    }
}
