"use client";

import { useEffect, useState, useMemo } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Board, Card } from "@/types";
import { useBoardStore } from "@/lib/store/useBoardStore";
import { BoardListContainer } from "./BoardListContainer";
import { SearchBar } from "./SearchBar";
import { updateListOrder as updateListOrderAction, updateCardOrder as updateCardOrderAction } from "@/actions/board";
import { motion, AnimatePresence } from "framer-motion";
import { useSettingsStore } from "@/lib/store/useSettingsStore";
import { cn } from "@/lib/utils";
import { Zap, Activity as ActivityIcon } from "lucide-react";
import { ButlerModal } from "@/components/modals/ButlerModal";
import { ActivityLog } from "./ActivityLog";

interface BoardClientProps {
    initialBoard: Board;
}

export const BoardClient = ({ initialBoard }: BoardClientProps) => {
    const { board, setBoard, moveCard, updateListOrder } = useBoardStore();
    const { compactMode } = useSettingsStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [isButlerOpen, setIsButlerOpen] = useState(false);
    const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);

    useEffect(() => {
        setBoard(initialBoard);
    }, [initialBoard, setBoard]);

    const filteredBoard = useMemo(() => {
        if (!board || !searchQuery.trim()) return board;
        const query = searchQuery.toLowerCase();
        const filteredLists = board.lists
            .filter(list => !list.isArchived)
            .map(list => ({
                ...list,
                cards: list.cards.filter((card: Card) => {
                    if (card.isArchived) return false;
                    if (!searchQuery.trim()) return true;
                    const query = searchQuery.toLowerCase();
                    if (card.title.toLowerCase().includes(query)) return true;
                    if (card.description?.toLowerCase().includes(query)) return true;
                    if (card.labels?.some(cl => cl.label.title.toLowerCase().includes(query))) return true;
                    return false;
                })
            }));
        return { ...board, lists: filteredLists };
    }, [board, searchQuery]);

    const onDragEnd = (result: DropResult) => {
        const { destination, source, type } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        if (type === "list") {
            if (!board) return;
            const items = Array.from(board.lists);
            const [reorderedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reorderedItem);
            const newListOrder = items.map((item, index) => ({ ...item, position: index + 1 }));
            updateListOrder(newListOrder.map(l => l.id));
            updateListOrderAction(board.id, newListOrder.map((l) => ({ id: l.id, position: l.position })));
            return;
        }

        if (type === "card") {
            moveCard(result.draggableId, source.droppableId, destination.droppableId, destination.index);
            const currentBoard = useBoardStore.getState().board;
            if (!currentBoard) return;
            const destList = currentBoard.lists.find(l => l.id === destination.droppableId);
            if (!destList) return;
            const destCardsToUpdate = destList.cards.map((card, index) => ({ id: card.id, position: index + 1, listId: destList.id }));
            let allUpdates = [...destCardsToUpdate];
            if (source.droppableId !== destination.droppableId) {
                const sourceList = currentBoard.lists.find(l => l.id === source.droppableId);
                if (sourceList) {
                    const sourceCardsToUpdate = sourceList.cards.map((card, index) => ({ id: card.id, position: index + 1, listId: sourceList.id }));
                    allUpdates = [...allUpdates, ...sourceCardsToUpdate];
                }
            }
            updateCardOrderAction(currentBoard.id, allUpdates);
        }
    };

    if (!board) return <div>Loading...</div>;

    const displayBoard = filteredBoard || board;
    const matchCount = searchQuery ? displayBoard.lists.reduce((sum, list) => sum + list.cards.length, 0) : null;

    return (
        <div className="relative h-full w-full overflow-hidden">
            {/* Next-Level Dynamic Background */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] scale-110 animate-float-slow"
                style={{ backgroundImage: `url(${board.imageFullUrl})` }}
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] dark:bg-black/80" />

            {/* Animated Gradient Overlays for extra depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-black/60 mix-blend-overlay pointer-events-none" />

            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                    "relative h-full w-full pb-20 overflow-x-auto flex flex-col transition-all",
                    compactMode ? "p-3" : "p-6"
                )}
            >
                <div className={cn(
                    "flex flex-col md:flex-row md:items-center justify-between gap-4 px-2 transition-all",
                    compactMode ? "mb-4" : "mb-8"
                )}>
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="space-y-1"
                    >
                        <h1 className={cn(
                            "font-black text-white tracking-tighter drop-shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center gap-3 transition-all",
                            compactMode ? "text-2xl" : "text-4xl"
                        )}>
                            <motion.span
                                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                            >
                                💎
                            </motion.span>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-300">
                                {board.title}
                            </span>
                        </h1>
                        <p className="text-blue-400/60 text-[10px] font-black uppercase tracking-[0.5em] ml-1">Elite Neural Workspace</p>
                    </motion.div>

                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="flex items-center gap-4"
                    >
                        <button
                            onClick={() => setIsActivityLogOpen(true)}
                            className="h-12 w-12 rounded-2xl bg-neutral-600/10 border border-neutral-500/20 flex items-center justify-center hover:bg-neutral-600 hover:text-white transition-all group relative"
                        >
                            <ActivityIcon className="h-5 w-5 text-neutral-400 group-hover:text-white" />
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                Activity Feed
                            </div>
                        </button>

                        <button
                            onClick={() => setIsButlerOpen(true)}
                            className="h-12 w-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all group relative"
                        >
                            <Zap className="h-5 w-5 text-blue-400 group-hover:text-white group-hover:animate-pulse" />
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                Butler Engine
                            </div>
                        </button>

                        <div className="relative group">
                            <SearchBar onSearchChange={setSearchQuery} />
                            <div className="absolute inset-0 bg-blue-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </div>

                        <AnimatePresence>
                            {searchQuery && matchCount !== null && (
                                <motion.span
                                    initial={{ scale: 0.8, opacity: 0, x: 20 }}
                                    animate={{ scale: 1, opacity: 1, x: 0 }}
                                    exit={{ scale: 0.8, opacity: 0, x: 20 }}
                                    className="text-[10px] font-black text-white bg-blue-600 px-4 py-2 rounded-2xl backdrop-blur-xl shadow-2xl border border-white/20 uppercase tracking-[0.2em]"
                                >
                                    {matchCount} {matchCount === 1 ? 'insight' : 'insights'}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                <div className="flex-1 min-h-0">
                    <DragDropContext onDragEnd={onDragEnd}>
                        <BoardListContainer lists={displayBoard.lists} />
                    </DragDropContext>
                </div>
            </motion.main>

            <AnimatePresence>
                {isButlerOpen && (
                    <ButlerModal
                        boardId={board.id}
                        rules={board.automationRules || []}
                        onClose={() => setIsButlerOpen(false)}
                    />
                )}
            </AnimatePresence>

            <ActivityLog
                boardId={board.id}
                isOpen={isActivityLogOpen}
                onClose={() => setIsActivityLogOpen(false)}
            />

            <style jsx global>{`
                @keyframes float-slow {
                    0% { transform: scale(1.1) translate(0, 0); }
                    50% { transform: scale(1.18) translate(-1%, -0.5%); }
                    100% { transform: scale(1.1) translate(0, 0); }
                }
                .animate-float-slow {
                    animation: float-slow 45s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};
