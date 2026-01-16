"use client";

import { useState, useRef, useEffect } from "react";
import { Lock, Users, Globe, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateBoardVisibility } from "@/actions/visibility";
import { cn } from "@/lib/utils";

interface VisibilityBadgeProps {
    boardId: string;
    initialVisibility: string;
}

const visibilityOptions = [
    {
        id: "PRIVATE",
        label: "Private",
        description: "Only board members can see this board.",
        icon: Lock,
        color: "text-red-500",
        bg: "bg-red-500/10"
    },
    {
        id: "WORKSPACE",
        label: "Workspace",
        description: "All members of the workspace can see this board.",
        icon: Users,
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        id: "PUBLIC",
        label: "Public",
        description: "Anyone on the internet can see this board.",
        icon: Globe,
        color: "text-green-500",
        bg: "bg-green-500/10"
    }
];

export const VisibilityBadge = ({ boardId, initialVisibility }: VisibilityBadgeProps) => {
    const [visibility, setVisibility] = useState(initialVisibility);
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    const currentOption = visibilityOptions.find(opt => opt.id === visibility) || visibilityOptions[1];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const onSelect = async (id: string) => {
        setVisibility(id);
        setIsOpen(false);
        await updateBoardVisibility(boardId, id);
    };

    return (
        <div className="relative" ref={popoverRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/10 transition-all active:scale-95 group",
                    isOpen && "bg-white/10"
                )}
            >
                <currentOption.icon className={cn("h-3.5 w-3.5", currentOption.color)} />
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white">
                    {currentOption.label}
                </span>
                <ChevronDown className={cn("h-3 w-3 text-neutral-400 transition-transform", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute left-0 top-full mt-2 w-72 bg-white dark:bg-[#020617] rounded-[1.5rem] shadow-2xl border border-neutral-100 dark:border-white/10 z-[105] overflow-hidden"
                    >
                        <div className="p-4 border-b border-neutral-100 dark:border-white/5 bg-neutral-50/50 dark:bg-black/20">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
                                Visibility Settings
                            </span>
                        </div>
                        <div className="p-3 space-y-2">
                            {visibilityOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => onSelect(option.id)}
                                    className={cn(
                                        "w-full text-left p-3 rounded-2xl transition hover:bg-neutral-50 dark:hover:bg-white/5 flex gap-4 group/item",
                                        visibility === option.id && "bg-neutral-50 dark:bg-white/5"
                                    )}
                                >
                                    <div className={cn("p-2 rounded-xl h-fit", option.bg)}>
                                        <option.icon className={cn("h-4 w-4", option.color)} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold dark:text-white capitalize">{option.label}</span>
                                            {visibility === option.id && (
                                                <Check className="h-4 w-4 text-blue-500" />
                                            )}
                                        </div>
                                        <p className="text-[10px] text-neutral-500 font-medium leading-relaxed mt-1">
                                            {option.description}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
