"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Layout, Plus } from "lucide-react";
import { createBoard } from "@/actions/board";

interface BoardModalProps {
    onClose: () => void;
}

export const BoardModal = ({ onClose }: BoardModalProps) => {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);

        try {
            const result = await createBoard(title);

            if ("error" in result) {
                setError(result.error as string);
            } else {
                router.push(`/board/${result.boardId}`);
                onClose();
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-300">
            <div
                className="bg-white dark:bg-[#1e1e1e] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-neutral-200 dark:border-white/10 flex items-center justify-between bg-gradient-to-r from-blue-600/5 to-purple-600/5">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                            <Plus className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Create Board</h2>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">Start a new project</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition text-neutral-500 dark:text-neutral-400"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                            Board Title
                        </label>
                        <input
                            autoFocus
                            disabled={isLoading}
                            type="text"
                            placeholder="e.g. Marketing Launch, Daily Standup"
                            className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-900 transition-all outline-none text-neutral-900 dark:text-white"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 font-medium bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-200 dark:border-red-900/50">
                            {error}
                        </p>
                    )}

                    <div className="pt-2 flex flex-col gap-3">
                        <button
                            disabled={!title.trim() || isLoading}
                            type="submit"
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Layout className="h-5 w-5" />
                                    Create Board
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="w-full py-3 text-neutral-600 dark:text-neutral-400 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
