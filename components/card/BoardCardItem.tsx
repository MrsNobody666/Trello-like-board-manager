"use client";

import { Draggable } from "@hello-pangea/dnd";
import { Card } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSettingsStore } from "@/lib/store/useSettingsStore";
import { cn } from "@/lib/utils";
import { Clock, AlignLeft } from "lucide-react";

interface CardItemProps {
    card: Card;
    index: number;
}

export const BoardCardItem = ({ card, index }: CardItemProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const { compactMode } = useSettingsStore();

    const onClick = () => {
        router.push(`${pathname}?cardId=${card.id}`);
    };

    const coverImage = (card as any).coverImage;
    const isCoverColor = coverImage && coverImage.startsWith('#');
    const isCoverImage = coverImage && coverImage.startsWith('http');

    return (
        <Draggable draggableId={card.id} index={index}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    role="button"
                    onClick={onClick}
                    className="card-3d group relative flex flex-col gap-2 rounded-xl bg-[#22272b]/90 hover:bg-[#2c333a] dark:bg-[#1e1e1e]/60 border border-white/5 p-3 shadow-sm transition-all text-[#B6C2CF]"
                    style={provided.draggableProps.style}
                >
                    {/* Cover Image */}
                    {coverImage && (
                        <div
                            className="w-full h-32 bg-cover bg-center"
                            style={isCoverColor ? { backgroundColor: coverImage } : { backgroundImage: `url(${coverImage})` }}
                        />
                    )}

                    <div className="px-3 py-2">
                        {/* Labels */}
                        {card.labels && card.labels.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-1.5">
                                {card.labels.map(l => (
                                    <div
                                        key={l.labelId}
                                        className="h-2 w-10 rounded-full"
                                        style={{ backgroundColor: l.label.color }}
                                        title={l.label.title}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Title */}
                        <div className="text-sm font-normal text-[#B6C2CF] mb-1.5 break-words">
                            {card.title}
                        </div>

                        {/* Badges & Meta */}
                        <div className="flex items-center gap-x-3 text-[#9FADBC]">
                            {/* Due Date */}
                            {card.dueDate && (
                                <div className="flex items-center gap-x-1 p-1 rounded-sm hover:bg-neutral-700 text-[10px] font-medium">
                                    <Clock className="h-3 w-3" />
                                    <span>{new Date(card.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                </div>
                            )}

                            {/* Description Badge */}
                            {card.description && (
                                <AlignLeft className="h-3 w-3" />
                            )}

                            {/* Comments Count (mock) */}
                            {/* <div className="flex items-center gap-x-1">
                                <MessageSquare className="h-3 w-3" />
                                <span className="text-[10px]">2</span>
                            </div> */}
                        </div>

                        {/* Members (Bottom Right) */}
                        {/* <div className="flex justify-end mt-1">
                            <div className="h-6 w-6 rounded-full bg-neutral-600 flex items-center justify-center text-[10px] text-white font-bold">
                                N
                            </div>
                        </div> */}
                    </div>
                </div>
            )}
        </Draggable>
    );
};
