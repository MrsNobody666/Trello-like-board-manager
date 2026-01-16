"use client";

import { useEffect, useState } from "react";
import { useModalStore } from "@/lib/store/useModalStore";
import { AutomationModal } from "./AutomationModal";

export const GlobalAutomationModal = () => {
    const { isAutomationModalOpen, automationData, onCloseAutomation } = useModalStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    if (!isAutomationModalOpen || !automationData) return null;

    return (
        <AutomationModal
            boardId={automationData.boardId}
            rules={automationData.rules}
            onClose={onCloseAutomation}
        />
    );
};
