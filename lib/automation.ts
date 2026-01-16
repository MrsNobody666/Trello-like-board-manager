import { db } from "@/lib/db";

export type AutomationTrigger =
    | "card_created"
    | "card_moved"
    | "card_completed"
    | "due_date_reached"
    | "label_added"
    | "checklist_completed";

export interface AutomationAction {
    type: "add_checklist" | "add_label" | "set_due_date" | "move_card" | "add_member" | "add_comment" | "archive_card" | "remove_label";
    data: any;
}

export class AutomationEngine {
    /**
     * Process automation rules for a given trigger
     */
    static async processTrigger(
        trigger: AutomationTrigger,
        cardId: string,
        context: {
            listId?: string;
            boardId?: string;
            previousListId?: string;
            labelId?: string;
            checklistId?: string;
            listTitle?: string; // and other potential context
        }
    ) {
        try {
            // Find applicable rules
            const rules = await (db as any).automationRule.findMany({
                where: {
                    enabled: true,
                    triggerType: trigger,
                    ...(context.boardId ? { boardId: context.boardId } : {}),
                },
            });

            for (const rule of rules) {
                try {
                    // Check trigger conditions
                    if (!await this.checkTriggerConditions(rule, cardId, context)) {
                        continue;
                    }

                    // Parse and execute actions
                    const actions: AutomationAction[] = JSON.parse(rule.actions);

                    for (const action of actions) {
                        await this.executeAction(cardId, action);
                    }

                    // Log success
                    await db.automationLog.create({
                        data: {
                            ruleId: rule.id,
                            cardId,
                            status: "success",
                            message: `Executed ${actions.length} action(s)`,
                        },
                    });
                } catch (error) {
                    console.error("Single automation rule execution failed:", error);
                    // Log error
                    await db.automationLog.create({
                        data: {
                            ruleId: rule.id,
                            cardId,
                            status: "error",
                            message: error instanceof Error ? error.message : "Unknown error",
                        },
                    });
                }
            }
        } catch (error) {
            console.error("Automation engine error:", error);
        }
    }

    /**
     * Check if trigger conditions are met
     */
    private static async checkTriggerConditions(
        rule: any,
        cardId: string,
        context: any
    ): Promise<boolean> {
        if (!rule.conditions) return true;

        try {
            const conditions = JSON.parse(rule.conditions);

            // Condition: "to_list" (Example from spec)
            if (conditions.to_list && context.listTitle !== conditions.to_list) {
                return false;
            }

            // Condition Check: List ID match
            if (conditions.listId && context.listId !== conditions.listId) {
                return false;
            }

            // Condition Check: Label (Butler IF card has label X)
            if (conditions.ifHasLabel) {
                const hasLabel = await db.cardLabel.findFirst({
                    where: { cardId, labelId: conditions.ifHasLabel }
                });
                if (!hasLabel) return false;
            }

            // Condition Check: Due Date Overdue
            if (conditions.ifOverdue) {
                const card = await db.card.findUnique({ where: { id: cardId } });
                if (!card?.dueDate || card.dueDate > new Date()) return false;
            }

            return true;
        } catch {
            return true;
        }
    }

    /**
     * Execute a single automation action
     */
    private static async executeAction(cardId: string, action: any) {
        switch (action.type) {
            case "set_due_complete": // From Spec
                await db.card.update({
                    where: { id: cardId },
                    data: { description: (await db.card.findUnique({ where: { id: cardId } }))?.description + "\n\n✅ Marked as completed by automation." },
                });
                // In a real app we might have a specific field for this
                break;

            case "post_comment": // From Spec
            case "add_comment":
                await db.comment.create({
                    data: {
                        cardId,
                        text: action.text || action.data?.text || "Automated comment",
                    },
                });
                break;

            case "add_checklist":
                const checklist = await db.checklist.create({
                    data: {
                        cardId,
                        title: action.data?.title || "Checklist",
                    },
                });

                if (action.data?.items && Array.isArray(action.data.items)) {
                    await db.checklistItem.createMany({
                        data: action.data.items.map((item: string) => ({
                            checklistId: checklist.id,
                            title: item,
                        })),
                    });
                }
                break;

            case "add_label":
                await db.cardLabel.create({
                    data: {
                        cardId,
                        labelId: action.data.labelId,
                    },
                }).catch(() => { });
                break;

            case "move_card":
                await db.card.update({
                    where: { id: cardId },
                    data: { listId: action.data.listId },
                });
                break;

            case "archive_card":
                await db.card.update({
                    where: { id: cardId },
                    data: { isArchived: true },
                });
                break;

            default:
                console.warn(`Unknown automation action type: ${action.type}`);
        }
    }
}
