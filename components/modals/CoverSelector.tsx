"use client";

import { useState } from "react";
import { Image, Check } from "lucide-react";
import { updateCard } from "@/actions/card";

interface CoverSelectorProps {
    cardId: string;
    boardId: string;
    currentCover?: string | null;
}

const COVER_COLORS = [
    { name: "Blue", value: "#3b82f6" },
    { name: "Green", value: "#10b981" },
    { name: "Red", value: "#ef4444" },
    { name: "Yellow", value: "#f59e0b" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Pink", value: "#ec4899" },
    { name: "Indigo", value: "#6366f1" },
    { name: "Teal", value: "#14b8a6" },
];

const COVER_IMAGES = [
    "https://images.unsplash.com/photo-1557683316-973673baf926?w=400",
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400",
    "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400",
];

export const CoverSelector = ({ cardId, boardId, currentCover }: CoverSelectorProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleCoverSelect = async (cover: string) => {
        await updateCard(cardId, boardId, { coverImage: cover });
        setIsOpen(false);
    };

    const handleRemoveCover = async () => {
        await updateCard(cardId, boardId, { coverImage: null });
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left bg-white dark:bg-white/5 hover:bg-neutral-50 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/5 px-4 py-2.5 rounded-lg flex items-center gap-x-3 text-sm font-medium transition shadow-sm dark:text-neutral-200 group"
            >
                <Image className="h-4 w-4 text-neutral-400 group-hover:text-purple-500 transition" />
                Cover
            </button>

            {isOpen && (
                <div className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-[#1e1e1e] rounded-xl shadow-2xl z-20 p-4 border border-neutral-100 dark:border-white/10">
                    <h4 className="text-sm font-semibold mb-3 dark:text-white">Cover</h4>

                    {/* Colors */}
                    <div className="mb-4">
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Colors</p>
                        <div className="grid grid-cols-4 gap-2">
                            {COVER_COLORS.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => handleCoverSelect(color.value)}
                                    className="h-10 rounded-lg relative hover:scale-105 transition"
                                    style={{ backgroundColor: color.value }}
                                    title={color.name}
                                >
                                    {currentCover === color.value && (
                                        <Check className="h-4 w-4 text-white absolute inset-0 m-auto" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Images */}
                    <div className="mb-4">
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Images</p>
                        <div className="grid grid-cols-2 gap-2">
                            {COVER_IMAGES.map((img) => (
                                <button
                                    key={img}
                                    onClick={() => handleCoverSelect(img)}
                                    className="h-16 rounded-lg bg-cover bg-center relative hover:scale-105 transition border-2 border-transparent hover:border-blue-500"
                                    style={{ backgroundImage: `url(${img})` }}
                                >
                                    {currentCover === img && (
                                        <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center">
                                            <Check className="h-5 w-5 text-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Remove */}
                    {currentCover && (
                        <button
                            onClick={handleRemoveCover}
                            className="w-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg py-2 text-sm font-medium transition"
                        >
                            Remove Cover
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
