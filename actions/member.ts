"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const assignMember = async (cardId: string, memberId: string, boardId: string) => {
    try {
        await db.cardMember.create({
            data: { cardId, memberId }
        });

        revalidatePath(`/board/${boardId}`);
    } catch (error) {
        console.error("Failed to assign member", error);
    }
};

export const removeMember = async (cardId: string, memberId: string, boardId: string) => {
    try {
        await db.cardMember.delete({
            where: {
                cardId_memberId: { cardId, memberId }
            }
        });

        revalidatePath(`/board/${boardId}`);
    } catch (error) {
        console.error("Failed to remove member", error);
    }
};

export const getWorkspaceMembers = async (workspaceId: string) => {
    return await db.member.findMany({
        where: {
            workspaces: {
                some: { workspaceId }
            }
        }
    });
};
