"use client";

import Link from "next/link";
import { Search, Bell, HelpCircle, Plus, ChevronDown } from "lucide-react";
import { InteractiveIcon } from "./ui/InteractiveIcon";
import { Popover } from "./ui/Popover";
import { useModalStore } from "@/lib/store/useModalStore";

export const Navbar = () => {
    const { onOpenBoardModal } = useModalStore();

    return (
        <nav className="fixed top-0 w-full h-14 z-50 border-b border-white/10 glass px-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
                        <span className="text-white font-bold text-lg">T</span>
                    </div>
                    <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 hidden md:block">
                        Tasker AI
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-x-1 ml-4">
                    <NavPopover label="Workspaces" content={<div className="p-2 w-48 text-sm">Current: Tasker Workspace</div>} />
                    <NavPopover label="Recent" content={<div className="p-2 w-48 text-sm">No recent boards</div>} />
                    <NavPopover label="Starred" content={<div className="p-2 w-48 text-sm">No starred boards</div>} />
                    <NavPopover label="Templates" content={
                        <div className="p-2 w-48 text-sm flex flex-col gap-1">
                            <div className="p-1 hover:bg-white/10 rounded cursor-pointer">Project Management</div>
                            <div className="p-1 hover:bg-white/10 rounded cursor-pointer">Kanban Template</div>
                            <div className="p-1 hover:bg-white/10 rounded cursor-pointer">Simple To-Do</div>
                        </div>
                    } />

                    <button
                        onClick={onOpenBoardModal}
                        className="ml-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-1.5 px-3 rounded-[4px] transition-colors shadow-[0_0_10px_rgba(37,99,235,0.3)] animate-pulse hover:animate-none"
                    >
                        Create
                    </button>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                <div className="hidden md:flex relative items-center group">
                    <Search className="absolute left-3 h-4 w-4 text-neutral-400 z-10 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        placeholder="Search..."
                        className="h-9 w-64 bg-white/5 border border-white/10 rounded-xl pl-10 text-sm text-neutral-200 placeholder:text-neutral-500 focus:bg-white/10 focus:border-blue-500/50 focus:w-80 transition-all duration-300 outline-none"
                    />
                    {/* Search Dropdown Mock */}
                    <div className="absolute top-12 left-0 w-full bg-[#1e2330] border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 transform origin-top p-2">
                        <div className="text-xs text-neutral-500 px-2 py-1 uppercase font-semibold">Recent</div>
                        <div className="p-2 hover:bg-white/5 rounded cursor-pointer text-sm text-neutral-300">Project Alpha</div>
                        <div className="p-2 hover:bg-white/5 rounded cursor-pointer text-sm text-neutral-300">Marketing Q1</div>
                    </div>
                </div>

                <NavPopover
                    label=""
                    content={<div className="p-4 w-64 text-sm text-neutral-300">
                        <h4 className="font-bold text-white mb-2">Notifications</h4>
                        <div className="space-y-2">
                            <div className="flex gap-2 p-2 hover:bg-white/5 rounded">
                                <div className="h-2 w-2 mt-1.5 rounded-full bg-blue-500 shrink-0" />
                                <p>New comment on <span className="text-white">Task #12</span></p>
                            </div>
                            <div className="flex gap-2 p-2 hover:bg-white/5 rounded">
                                <div className="h-2 w-2 mt-1.5 rounded-full bg-green-500 shrink-0" />
                                <p>Project marked as complete</p>
                            </div>
                        </div>
                    </div>}
                    trigger={<InteractiveIcon icon={Bell} size="sm" />}
                />

                <InteractiveIcon icon={HelpCircle} size="sm" />

                <Link href="/settings">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-sky-400 to-blue-500 p-[1px] cursor-pointer hover:scale-105 transition-transform" title="Settings">
                        <div className="h-full w-full rounded-full bg-neutral-900 border-2 border-transparent flex items-center justify-center overflow-hidden">
                            <span className="text-xs font-bold text-white">JD</span>
                        </div>
                    </div>
                </Link>
            </div>
        </nav>
    );
};

const NavPopover = ({ label, content, trigger }: { label: string; content: React.ReactNode, trigger?: React.ReactNode }) => (
    <Popover
        trigger={
            trigger || (
                <button className="flex items-center gap-x-1 px-3 py-1.5 text-sm font-medium text-neutral-300 hover:bg-white/10 rounded-[4px] transition-colors">
                    {label}
                    <ChevronDown className="h-3 w-3 opacity-70" />
                </button>
            )
        }
        content={content}
        align="left"
    />
);

const IconButton = ({ icon: Icon }: { icon: any }) => (
    <button className="p-2 text-neutral-300 hover:bg-white/10 hover:text-white rounded-full transition-colors relative">
        <Icon className="h-5 w-5" />
    </button>
);
