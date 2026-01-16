"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const addAttachment = async (cardId: string, boardId: string, data: { name: string, url: string, type: string }) => {
    try {
        await db.attachment.create({
            data: {
                cardId,
                ...data
            }
        });

        revalidatePath(`/board/${boardId}`);
    } catch (error) {
        console.error("Failed to add attachment", error);
    }
};

export const deleteAttachment = async (id: string, boardId: string) => {
    try {
        await db.attachment.delete({
            where: { id }
        });

        revalidatePath(`/board/${boardId}`);
    } catch (error) {
        console.error("Failed to delete attachment", error);
    }
};
