"use client";

import { Draggable, Droppable } from "@hello-pangea/dnd";
import { List } from "@/types";
import { BoardCardItem } from "../card/BoardCardItem";
import { MoreHorizontal, Plus, X, Copy, Trash, Edit2, Archive } from "lucide-react";
import { ElementRef, useRef, useState, useEffect } from "react";
import { createCard, deleteList, copyList, updateList } from "@/actions/board";
import { archiveList } from "@/actions/card";
import { motion, AnimatePresence } from "framer-motion";
import { useSettingsStore } from "@/lib/store/useSettingsStore";
import { cn } from "@/lib/utils";

interface ListItemProps {
    list: List;
    index: number;
}

export const ListItem = ({ list, index }: ListItemProps) => {
    const { compactMode } = useSettingsStore();
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"textarea">>(null);
    const titleInputRef = useRef<ElementRef<"input">>(null);
    const optionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
                setShowOptions(false);
            }
        };
        if (showOptions) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showOptions]);

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => inputRef.current?.focus());
    };

    const disableEditing = () => setIsEditing(false);

    const onSubmit = async (formData: FormData) => {
        const title = formData.get("title") as string;
        if (!title) return;
        await createCard(list.id, list.boardId, title);
        disableEditing();
    };

    const enableTitleEditing = () => {
        setIsEditingTitle(true);
        setShowOptions(false);
        setTimeout(() => {
            titleInputRef.current?.focus();
            titleInputRef.current?.select();
        });
    }

    const onTitleBlur = async () => setIsEditingTitle(false);

    const onTitleSubmit = async (formData: FormData) => {
        const title = formData.get("title") as string;
        if (!title || title === list.title) {
            setIsEditingTitle(false);
            return;
        }
        await updateList(list.id, list.boardId, title);
        setIsEditingTitle(false);
    }

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            formRef.current?.requestSubmit();
        }
        if (e.key === "Escape") disableEditing();
    };

    const onTitleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") setIsEditingTitle(false);
    }

    const onDelete = async () => {
        if (confirm("Are you sure you want to delete this list?")) {
            await deleteList(list.id, list.boardId);
        }
        setShowOptions(false);
    };

    const onCopy = async () => {
        await copyList(list.id, list.boardId);
        setShowOptions(false);
    }

    return (
        <Draggable draggableId={list.id} index={index}>
            {(provided) => (
                <li
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    className={cn(
                        "shrink-0 h-full select-none group w-[272px]",
                        compactMode && "w-[260px]"
                    )}
                >
                    <div
                        {...provided.dragHandleProps}
                        className="w-full rounded-xl bg-black/80 dark:bg-[#101214] pb-2 shadow-md border border-white/5"
                    >
                        <div className="flex items-center justify-between px-3 py-3 gap-x-2">
                            {isEditingTitle ? (
                                <form action={onTitleSubmit} className="w-full">
                                    <input
                                        ref={titleInputRef}
                                        name="title"
                                        onBlur={onTitleBlur}
                                        onKeyDown={onTitleKeyDown}
                                        defaultValue={list.title}
                                        className="w-full px-2 py-1 text-sm font-semibold border-2 border-blue-500 rounded-md outline-none bg-black text-white focus:ring-0"
                                    />
                                </form>
                            ) : (
                                <div
                                    onClick={enableTitleEditing}
                                    className="w-full text-sm font-semibold pl-2 text-neutral-200 cursor-pointer"
                                >
                                    {list.title}
                                </div>
                            )}

                            <button
                                onClick={() => setShowOptions(!showOptions)}
                                className="text-neutral-400 hover:text-white hover:bg-white/10 p-1 rounded-md transition-colors relative"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </button>

                            <AnimatePresence>
                                {showOptions && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        ref={optionsRef}
                                        className="absolute right-2 top-10 w-60 bg-[#282e33] rounded-lg shadow-xl z-50 border border-white/10 overflow-hidden py-2"
                                    >
                                        <div className="text-sm text-center font-medium text-neutral-400 pb-2 border-b border-white/10 mb-1">
                                            List Actions
                                        </div>
                                        <button onClick={onCopy} className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-white/10 hover:text-white transition-colors">
                                            Copy list...
                                        </button>
                                        <button onClick={enableTitleEditing} className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-white/10 hover:text-white transition-colors">
                                            Rename list...
                                        </button>
                                        <div className="h-px bg-white/10 my-1 mx-2" />
                                        <button onClick={() => archiveList(list.id, list.boardId)} className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-white/10 hover:text-white transition-colors">
                                            Archive this list
                                        </button>
                                        <button onClick={onDelete} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-400 transition-colors">
                                            Delete list
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <Droppable droppableId={list.id} type="card">
                            {(provided) => (
                                <ol
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={cn(
                                        "flex flex-col gap-y-2 px-2 min-h-[2px]",
                                        list.cards.length > 0 ? "mt-0.5" : "mt-0"
                                    )}
                                >
                                    {list.cards.sort((a, b) => a.position - b.position).map((card, index) => (
                                        <BoardCardItem key={card.id} index={index} card={card} />
                                    ))}
                                    {provided.placeholder}

                                    {isEditing && (
                                        <motion.form
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            ref={formRef}
                                            action={onSubmit}
                                            className="m-0"
                                        >
                                            <textarea
                                                ref={inputRef}
                                                id="title"
                                                name="title"
                                                placeholder="Enter a title for this card..."
                                                className="w-full rounded-lg bg-[#22272b] p-3 text-sm text-white border-none shadow-sm outline-none ring-0 placeholder:text-neutral-500 min-h-[80px] resize-none"
                                                autoFocus
                                                onKeyDown={onKeyDown}
                                            />
                                            <div className="flex items-center gap-x-2 mt-2">
                                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-[4px] transition-colors">
                                                    Add card
                                                </button>
                                                <button onClick={disableEditing} type="button" className="text-neutral-400 hover:text-neutral-200 transition-colors p-1.5 hover:bg-white/10 rounded-md">
                                                    <X className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </motion.form>
                                    )}
                                </ol>
                            )}
                        </Droppable>

                        {!isEditing && (
                            <div className="px-2 pt-2">
                                <button
                                    onClick={enableEditing}
                                    className="flex items-center gap-x-2 w-full text-neutral-400 hover:text-neutral-200 hover:bg-white/10 rounded-lg p-2 text-sm font-medium text-left transition-colors"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add a card
                                </button>
                            </div>
                        )}
                    </div>
                </li>
            )}
        </Draggable>
    );
};
