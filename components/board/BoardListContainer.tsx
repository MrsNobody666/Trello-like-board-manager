"use client";

import { Droppable } from "@hello-pangea/dnd";
import { List } from "@/types";
import { ListItem } from "../list/ListItem";
import { useState, useRef, ElementRef } from "react";
import { Plus, X } from "lucide-react";
import { createList } from "@/actions/board";
import { useBoardStore } from "@/lib/store/useBoardStore";

interface ListContainerProps {
    lists: List[];
}

export const BoardListContainer = ({ lists }: ListContainerProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<ElementRef<"input">>(null);
    const formRef = useRef<ElementRef<"form">>(null);
    const { board } = useBoardStore(); // To get boardId

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
        });
    };

    const disableEditing = () => {
        setIsEditing(false);
    };

    const onSubmit = async (formData: FormData) => {
        const title = formData.get("title") as string;
        if (!title || !board) return;

        await createList(board.id, title);
        disableEditing();
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") disableEditing();
    };

    // sort by position just in case
    const sortedLists = [...(lists || [])].sort((a, b) => a.position - b.position);

    return (
        <Droppable droppableId="lists" type="list" direction="horizontal">
            {(provided) => (
                <ol
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex h-full gap-x-3 items-start"
                >
                    {sortedLists.map((list, index) => (
                        <ListItem key={list.id} index={index} list={list} />
                    ))}
                    {provided.placeholder}

                    <div className="shrink-0 w-[272px]">
                        {isEditing ? (
                            <form
                                ref={formRef}
                                action={onSubmit}
                                className="w-full rounded-md bg-[#f1f2f4] dark:bg-[#101204] p-3 shadow-md space-y-4"
                            >
                                <input
                                    ref={inputRef}
                                    name="title"
                                    className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition w-full outline-none focus:ring-2 ring-blue-500 rounded text-black dark:text-white dark:bg-neutral-700"
                                    placeholder="Enter list title..."
                                    onKeyDown={onKeyDown}
                                />
                                <div className="flex items-center gap-x-1">
                                    <button type="submit" className="bg-blue-600 text-white rounded-md px-3 py-1.5 text-sm hover:bg-blue-700">
                                        Add List
                                    </button>
                                    <button type="button" onClick={disableEditing} className="p-2 text-neutral-500 hover:text-neutral-900">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <button
                                onClick={enableEditing}
                                className="w-full rounded-md bg-[#ffffff3d] hover:bg-[#ffffff52] transition p-4 flex items-center font-medium text-sm text-white"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add another list
                            </button>
                        )}
                    </div>
                    <div className="flex-shrink-0 w-1"></div>
                </ol>
            )}
        </Droppable>
    );
};
