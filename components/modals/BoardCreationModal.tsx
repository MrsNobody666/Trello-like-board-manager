"use client";

import { useEffect, useState } from "react";
import { BoardModal } from "@/components/modals/BoardModal";
import { useModalStore } from "@/lib/store/useModalStore";

export const BoardCreationModal = () => {
    const [isMounted, setIsMounted] = useState(false);
    const { isBoardModalOpen, onCloseBoardModal } = useModalStore();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted || !isBoardModalOpen) {
        return null;
    }

    return (
        <BoardModal onClose={onCloseBoardModal} />
    );
};
