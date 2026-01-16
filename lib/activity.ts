import { db } from "./db";

export enum ActivityAction {
    CARD_CREATED = "CARD_CREATED",
    CARD_MOVED = "CARD_MOVED",
    CARD_UPDATED = "CARD_UPDATED",
    CARD_ARCHIVED = "CARD_ARCHIVED",
    CARD_DELETED = "CARD_DELETED",
    COMMENT_ADDED = "COMMENT_ADDED",
    LABEL_ADDED = "LABEL_ADDED",
    LABEL_REMOVED = "LABEL_REMOVED",
    LIST_CREATED = "LIST_CREATED",
    LIST_MOVED = "LIST_MOVED",
    LIST_ARCHIVED = "LIST_ARCHIVED",
    MEMBER_ASSIGNED = "MEMBER_ASSIGNED",
    MEMBER_REMOVED = "MEMBER_REMOVED",
}

export type EntityType = "CARD" | "LIST" | "LABEL" | "BOARD" | "COMMENT" | "MEMBER";

interface LogActivityProps {
    boardId: string;
    userId: string;
    action: ActivityAction;
    entityType: EntityType;
    entityId: string;
    cardId?: string;
    details?: any;
}

export async function logActivity({
    boardId,
    userId,
    action,
    entityType,
    entityId,
    cardId,
    details
}: LogActivityProps) {
    try {
        await (db as any).activity.create({
            data: {
                boardId,
                userId,
                action,
                entityType,
                entityId,
                cardId,
                details: details ? JSON.stringify(details) : null,
            }
        });
    } catch (error) {
        console.error("[ACTIVITY_LOG_ERROR]", error);
    }
}
