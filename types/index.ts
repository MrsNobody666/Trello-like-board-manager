export interface Label {
    id: string;
    title: string;
    color: string;
}

export interface ChecklistItem {
    id: string;
    title: string;
    isChecked: boolean;
    checklistId: string;
    dueDate: string | Date | null;
}

export interface Checklist {
    id: string;
    title: string;
    cardId: string;
    items: ChecklistItem[];
}

export interface CardLabel {
    cardId: string;
    labelId: string;
    label: Label;
}

export interface Member {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
}

export interface Attachment {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number | null;
}

export interface CardMember {
    cardId: string;
    memberId: string;
    member: Member;
}

export interface CustomField {
    id: string;
    name: string;
    type: "TEXT" | "NUMBER" | "DATE" | "DROPDOWN";
    options: string | null;
}

export interface CustomFieldValue {
    id: string;
    value: string | null;
    cardId: string;
    fieldId: string;
    field: CustomField;
}

export interface AutomationRule {
    id: string;
    boardId: string;
    name: string;
    enabled: boolean;
    triggerType: string;
    triggerData: string | null;
    actions: string;
}

export interface Card {
    id: string;
    title: string;
    description: string | null;
    position: number;
    listId: string;
    dueDate: string | Date | null;
    isArchived: boolean;
    labels: CardLabel[];
    members: CardMember[];
    attachments: Attachment[];
    checklists: Checklist[];
    customFields: CustomFieldValue[];
}

export interface Workspace {
    id: string;
    name: string;
    description: string | null;
}

export interface List {
    id: string;
    title: string;
    position: number;
    boardId: string;
    cards: Card[];
    isArchived: boolean;
}

export interface Board {
    id: string;
    title: string;
    imageId: string;
    imageThumbUrl: string | null;
    imageFullUrl: string | null;
    workspaceId: string;
    workspace?: Workspace;
    lists: List[];
    automationRules: AutomationRule[];
    customFields: CustomField[];
}
