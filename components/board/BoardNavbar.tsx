"use client";

import { Board } from "@/types";
import { Star, Lock, Users, Globe, ChevronDown, Filter, MoreHorizontal, LayoutTemplate } from "lucide-react";
import { AutomationButton } from "./AutomationButton";

interface BoardNavbarProps {
    board: Board;
    automationRules: any[]; // relaxed type for now
}

export const BoardNavbar = ({ board, automationRules }: BoardNavbarProps) => {
    return (
        <div className="w-full h-14 z-40 bg-black/20 backdrop-blur-sm flex items-center justify-between px-6 border-b border-white/10 shrink-0">
            {/* Left Side: Title & Meta */}
            <div className="flex items-center gap-x-4">
                <div className="flex items-center gap-x-2 group cursor-pointer hover:bg-white/10 px-2 py-1 rounded-md transition-colors">
                    <h1 className="text-lg font-bold text-white whitespace-nowrap">
                        {board.title}
                    </h1>
                </div>

                <button className="text-neutral-400 hover:text-yellow-400 transition-colors">
                    <Star className="h-4 w-4" />
                </button>

                <div className="h-4 w-px bg-white/20 mx-1" />

                <button className="flex items-center gap-x-2 text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-[4px] text-sm font-medium transition-colors">
                    <Lock className="h-3 w-3" />
                    <span>Private</span>
                </button>

                <div className="h-4 w-px bg-white/20 mx-1" />

                <button className="flex items-center gap-x-2 text-neutral-300 hover:bg-white/10 px-3 py-1.5 rounded-[4px] text-sm font-medium transition-colors">
                    <LayoutTemplate className="h-3 w-3" />
                    <span>Board</span>
                </button>

                <ChevronDown className="h-3 w-3 text-white/50" />
            </div>

            {/* Right Side: Actions */}
            <div className="flex items-center gap-x-3">
                <button className="flex items-center gap-x-2 text-neutral-300 hover:bg-white/10 px-3 py-1.5 rounded-[4px] text-sm font-medium transition-colors">
                    <Filter className="h-3 w-3" />
                    <span>Filter</span>
                </button>

                <div className="h-4 w-px bg-white/20" />

                <div className="flex items-center gap-x-1">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-transparent hover:ring-white/20 cursor-pointer">
                        M
                    </div>
                    <div className="h-7 w-7 rounded-full bg-neutral-700 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white hover:bg-neutral-600 cursor-pointer transition-colors">
                        +2
                    </div>
                </div>

                <div className="h-4 w-px bg-white/20" />

                <AutomationButton boardId={board.id} rules={automationRules} />

                <button className="text-neutral-300 hover:bg-white/10 p-2 rounded-[4px] transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};
