"use client";

import { useState, useEffect } from "react";
import { RefreshCcw, Sparkles, Plus, Check, ExternalLink, Calendar, Mail as MailIcon } from "lucide-react";
import { syncGmail, getDiscoveredItems, convertToCard } from "@/actions/integrations";
import { useBoardStore } from "@/lib/store/useBoardStore";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const SyncManager = () => {
    const [isSyncing, setIsSyncing] = useState(false);
    const [items, setItems] = useState<any[]>([]);
    const [selectedBoard, setSelectedBoard] = useState("");
    const [selectedList, setSelectedList] = useState("");

    // In a real app, we'd fetch actual boards/lists. 
    // Here we'll just use a placeholder to demonstrate the power-up flow.
    const boards = [
        {
            id: "board-1", title: "Product Development", lists: [
                { id: "list-1", title: "Inbox" },
                { id: "list-2", title: "Backlog" }
            ]
        }
    ];

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        const discovered = await getDiscoveredItems();
        setItems(discovered);
    };

    const handleSync = async () => {
        setIsSyncing(true);
        await syncGmail();
        await loadItems();
        setIsSyncing(false);
    };

    const handleConvert = async (itemId: string) => {
        if (!selectedBoard || !selectedList) {
            alert("Please select a target board and list first.");
            return;
        }
        await convertToCard(itemId, selectedBoard, selectedList);
        await loadItems();
    };

    return (
        <div className="space-y-8">
            <div className="p-10 rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                            <RefreshCcw className={cn("h-8 w-8", isSyncing && "animate-spin")} />
                        </div>
                        <div>
                            <h4 className="text-3xl font-[1000] tracking-tighter">Gmail Sync Engine</h4>
                            <p className="text-blue-100 font-bold">Scanning for potential productivity gaps.</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-2">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-blue-200">Target Board</label>
                            <select
                                value={selectedBoard}
                                onChange={(e) => setSelectedBoard(e.target.value)}
                                className="block w-64 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-white/40 appearance-none cursor-pointer"
                            >
                                <option value="" className="text-black">Select Board</option>
                                {boards.map(b => <option key={b.id} value={b.id} className="text-black">{b.title}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-blue-200">Destination List</label>
                            <select
                                value={selectedList}
                                onChange={(e) => setSelectedList(e.target.value)}
                                className="block w-64 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-white/40 appearance-none cursor-pointer"
                            >
                                <option value="" className="text-black">Select List</option>
                                {boards.find(b => b.id === selectedBoard)?.lists.map(l => (
                                    <option key={l.id} value={l.id} className="text-black">{l.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={handleSync}
                            disabled={isSyncing}
                            className="px-10 py-5 bg-white text-blue-600 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(255,255,255,0.2)] hover:scale-105 transition active:scale-95 disabled:opacity-50"
                        >
                            {isSyncing ? "Scanning..." : "Launch Manual Scan"}
                        </button>
                    </div>
                </div>
                <Sparkles className="absolute -top-10 -right-10 h-72 w-72 text-white/5 rotate-12 pointer-events-none" />
            </div>

            <div className="space-y-6">
                <h5 className="text-sm font-black uppercase tracking-[0.3em] text-neutral-400 pl-4">Discovered Intelligence ({items.length})</h5>
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {items.map((item) => {
                            const metadata = JSON.parse(item.metadata || "{}");
                            const isEvent = metadata.type === "EVENT";

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="p-6 rounded-[2rem] bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-white/5 shadow-xl flex items-center justify-between group hover:border-blue-500/30 transition-all duration-500"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={cn(
                                            "h-14 w-14 rounded-2xl flex items-center justify-center shadow-inner",
                                            isEvent ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600" : "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
                                        )}>
                                            {isEvent ? <Calendar className="h-6 w-6" /> : <MailIcon className="h-6 w-6" />}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <h6 className="font-black text-lg">{item.title}</h6>
                                                <span className="px-3 py-1 bg-neutral-100 dark:bg-white/5 text-[9px] font-black uppercase tracking-widest text-neutral-400 rounded-full">{isEvent ? "Calendar" : "Gmail"}</span>
                                            </div>
                                            <p className="text-sm text-neutral-500 font-medium max-w-xl line-clamp-1">{item.description}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleConvert(item.id)}
                                        className="h-14 w-14 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-xl opacity-0 group-hover:opacity-100"
                                    >
                                        <Plus className="h-6 w-6" />
                                    </button>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {items.length === 0 && (
                        <div className="py-20 text-center space-y-4">
                            <div className="h-20 w-20 bg-neutral-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                <Check className="h-10 w-10 text-neutral-300" />
                            </div>
                            <p className="text-neutral-400 font-bold uppercase tracking-widest text-xs">Awaiting discovery scan...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
