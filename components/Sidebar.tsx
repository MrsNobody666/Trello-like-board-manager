"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layout, Inbox, Clock, Users, Settings, Plus, Star, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/lib/store/useModalStore";
import { useEffect, useState } from "react";
import { getBoards } from "@/actions/board";
import { Board } from "@prisma/client";

const routes = [
    {
        label: "Inbox",
        icon: Inbox,
        href: "/inbox",
    },
    {
        label: "Recent",
        icon: Clock,
        href: "/recent",
    },
    {
        label: "Members",
        icon: Users,
        href: "/members",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/settings",
    },
];

export const Sidebar = () => {
    const pathname = usePathname();
    const { onOpenBoardModal } = useModalStore();
    const [boards, setBoards] = useState<Board[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const data = await getBoards();
                setBoards(data);
            } catch (error) {
                console.error("Failed to fetch boards", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBoards();
    }, []);

    const starredBoards = boards.filter(b => (b as any).isStarred); // Mocking or waiting for schema update
    // Note: Prisma schema might not have isStarred yet. If not, we'll mock it or filter by ID for demo.
    // Checking schema... Board model usually has isFavorite or similar. 
    // If not, I'll display the first few as "Your Boards" and maybe hardcode one as starred for visual if field missing.

    return (
        <div className="flex flex-col h-full bg-[#030712] text-neutral-300 overflow-y-auto w-64 border-r border-white/10 dark:text-neutral-400">
            {/* Workspace Context Section */}
            <div className="px-4 py-4 mb-2">
                <div className="ios-btn flex items-center gap-3 p-2 bg-gradient-to-r from-blue-900/40 to-blue-800/40 border border-blue-500/20 rounded-lg cursor-pointer hover:bg-white/5 transition-colors group">
                    <div className="h-8 w-8 rounded bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-105 transition-transform">
                        T
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <h2 className="text-sm font-bold text-white truncate dark:text-white">Tasker Workspace</h2>
                        <p className="text-[10px] text-neutral-400">Free</p>
                    </div>
                    <ChevronDown className="h-3 w-3 text-neutral-400" />
                </div>
            </div>

            <div className="space-y-1 px-2">
                {routes.map((route) => (
                    <Link
                        href={route.href}
                        key={route.href}
                        className={cn(
                            "ios-btn text-sm group flex items-center px-3 py-2 w-full font-medium cursor-pointer hover:bg-white/10 rounded-lg transition-all",
                            pathname === route.href ? "bg-blue-600/10 text-blue-400" : "text-neutral-400 hover:text-white"
                        )}
                    >
                        <route.icon className={cn("h-4 w-4 mr-3 ios-icon", pathname === route.href && "text-blue-400")} />
                        {route.label}
                        {route.label === "Inbox" && (
                            <span className="ml-auto bg-blue-600/20 text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
                        )}
                    </Link>
                ))}
            </div>

            {/* Starred Boards */}
            <div className="mt-6 px-4">
                <div className="flex items-center justify-between mb-2 group">
                    <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider group-hover:text-neutral-300 transition-colors">Starred Boards</span>
                    <button onClick={onOpenBoardModal}>
                        <Plus className="ios-icon h-3 w-3 text-neutral-500 cursor-pointer hover:text-white transition-colors" />
                    </button>
                </div>
                <div className="space-y-1">
                    {isLoading ? (
                        <div className="text-xs text-neutral-500 px-2">Loading...</div>
                    ) : starredBoards.length === 0 ? (
                        <div className="text-xs text-neutral-500 px-2">No starred boards</div>
                    ) : (
                        starredBoards.map((board) => (
                            <Link
                                href={`/board/${board.id}`}
                                key={board.id}
                                className={cn(
                                    "ios-btn flex items-center gap-2 px-2 py-1.5 rounded-lg group transition-colors",
                                    pathname === `/board/${board.id}` ? "bg-white/10 text-white" : "hover:bg-white/5 text-neutral-400 hover:text-white"
                                )}
                            >
                                <div className="h-6 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-sm opacity-80 group-hover:opacity-100" />
                                <span className="text-sm font-medium flex-1 truncate">{board.title}</span>
                                {(board as any).isStarred && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
                            </Link>
                        ))
                    )}
                </div>
            </div>

            {/* Your Boards */}
            <div className="mt-6 px-4">
                <div className="flex items-center justify-between mb-2 group">
                    <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider group-hover:text-neutral-300 transition-colors">Your Boards</span>
                    <button onClick={onOpenBoardModal}>
                        <Plus className="ios-icon h-3 w-3 text-neutral-500 cursor-pointer hover:text-white transition-colors" />
                    </button>
                </div>
                <div className="space-y-1">
                    {isLoading ? (
                        <div className="text-xs text-neutral-500 px-2">Loading...</div>
                    ) : boards.length === 0 ? (
                        <div className="text-xs text-neutral-500 px-2">No boards found</div>
                    ) : (
                        boards.map((board) => (
                            <Link
                                href={`/board/${board.id}`}
                                key={board.id}
                                className={cn(
                                    "ios-btn flex items-center gap-2 px-2 py-1.5 rounded-lg group transition-colors",
                                    pathname === `/board/${board.id}` ? "bg-white/10 text-white" : "hover:bg-white/5 text-neutral-400 hover:text-white"
                                )}
                            >
                                <div className="h-6 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-sm opacity-80 group-hover:opacity-100" />
                                <span className="text-sm font-medium flex-1 truncate">{board.title}</span>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
