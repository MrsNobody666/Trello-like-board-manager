import { create } from 'zustand';

interface AutomationData {
    boardId: string;
    rules: any[];
}

interface ModalStore {
    isBoardModalOpen: boolean;
    onOpenBoardModal: () => void;
    onCloseBoardModal: () => void;

    isAutomationModalOpen: boolean;
    automationData: AutomationData | null;
    onOpenAutomation: (boardId: string, rules: any[]) => void;
    onCloseAutomation: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
    isBoardModalOpen: false,
    onOpenBoardModal: () => set({ isBoardModalOpen: true }),
    onCloseBoardModal: () => set({ isBoardModalOpen: false }),

    isAutomationModalOpen: false,
    automationData: null,
    onOpenAutomation: (boardId, rules) => set({ isAutomationModalOpen: true, automationData: { boardId, rules } }),
    onCloseAutomation: () => set({ isAutomationModalOpen: false }),
}));
