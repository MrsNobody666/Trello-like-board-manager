"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { AutomationTrigger, AutomationAction } from "@/lib/automation";

export async function createAutomationRule(
    boardId: string,
    name: string,
    triggerType: string,
    conditions: string,
    actions: any[]
) {
    await (db as any).automationRule.create({
        data: {
            boardId,
            name,
            triggerType,
            conditions,
            actions: JSON.stringify(actions),
        },
    });

    revalidatePath(`/board/${boardId}`);
}

export async function deleteAutomationRule(id: string, boardId: string) {
    await db.automationRule.delete({
        where: { id },
    });

    revalidatePath(`/board/${boardId}`);
}

export async function toggleAutomationRule(id: string, enabled: boolean, boardId: string) {
    await db.automationRule.update({
        where: { id },
        data: { enabled },
    });

    revalidatePath(`/board/${boardId}`);
}

export async function seedAutomationRules(boardId: string) {
    const defaultRules = [
        {
            name: "Auto-Archive Finished Tasks",
            triggerType: "checklist_completed",
            actions: JSON.stringify([{ type: "archive_card", data: {} }]),
            enabled: true,
        },
        {
            name: "Notify Label 'Priority'",
            triggerType: "label_added",
            actions: JSON.stringify([{ type: "add_comment", data: { text: "Tactical Priority Alpha assigned to this unit." } }]),
            enabled: true,
        }
    ];

    for (const rule of defaultRules) {
        await (db as any).automationRule.create({
            data: {
                ...rule,
                boardId,
                conditions: "{}"
            }
        });
    }

    revalidatePath(`/board/${boardId}`);
}
