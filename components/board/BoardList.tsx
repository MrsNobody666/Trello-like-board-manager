"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Layout, Plus } from "lucide-react";
import { format } from "date-fns";
import { BoardModal } from "@/components/modals/BoardModal";

interface Board {
    id: string;
    title: string;
    updatedAt: Date;
}

interface BoardListProps {
    initialBoards: Board[];
}

export const BoardList = ({ initialBoards }: BoardListProps) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Layout className="h-5 w-5 text-blue-500" />
                    Your Boards
                </h2>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View all</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialBoards.map((board) => (
                    <Link
                        href={`/board/${board.id}`}
                        key={board.id}
                        className="group relative h-40 rounded-xl overflow-hidden border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#1e1e1e] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity`} />
                        <div className="p-6 h-full flex flex-col justify-between relative z-10">
                            <h3 className="font-bold text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{board.title}</h3>
                            <div className="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
                                <span>Updated {format(new Date(board.updatedAt), "MMM d")}</span>
                                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </div>
                        </div>
                    </Link>
                ))}

                {/* Create Board Button */}
                <button
                    onClick={() => setShowModal(true)}
                    className="h-40 rounded-xl border-2 border-dashed border-neutral-200 dark:border-white/10 flex flex-col items-center justify-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:border-neutral-300 dark:hover:border-white/20 transition cursor-pointer bg-transparent"
                >
                    <div className="h-10 w-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-2 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition">
                        <Plus className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium">Create new board</span>
                </button>
            </div>

            {showModal && (
                <BoardModal onClose={() => setShowModal(false)} />
            )}
        </>
    );
};
