"use client";

import { useEffect, useState } from "react";
import { X, Activity as ActivityIcon, User, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getBoardActivities } from "@/actions/activity";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface ActivityLogProps {
    boardId: string;
    isOpen: boolean;
    onClose: () => void;
}

export const ActivityLog = ({ boardId, isOpen, onClose }: ActivityLogProps) => {
    const [activities, setActivities] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            const fetchActivities = async () => {
                setIsLoading(true);
                const data = await getBoardActivities(boardId);
                setActivities(data);
                setIsLoading(false);
            };
            fetchActivities();
        }
    }, [isOpen, boardId]);

    const generateActionText = (activity: any) => {
        const { action, entityType, card, details } = activity;
        const detailsData = details ? JSON.parse(details) : {};

        switch (action) {
            case "CARD_CREATED":
                return `created card "${detailsData.title || card?.title || "Untitled"}"`;
            case "CARD_MOVED":
                return `moved card "${card?.title || "Untitled"}" from list`;
            case "LIST_CREATED":
                return `created list "${detailsData.title || "Untitled"}"`;
            case "COMMENT_ADDED":
                return `added a comment to "${card?.title || "Untitled"}"`;
            case "LABEL_ADDED":
                return `added a label to "${card?.title || "Untitled"}"`;
            case "CARD_ARCHIVED":
                return `archived card "${card?.title || "Untitled"}"`;
            case "LIST_ARCHIVED":
                return `archived list`;
            default:
                return `${action.toLowerCase().replace(/_/g, " ")} ${entityType.toLowerCase()}`;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-[400px] bg-white dark:bg-[#020617] shadow-[-20px_0_50px_rgba(0,0,0,0.3)] z-[101] flex flex-col border-l border-white/10"
                    >
                        <div className="p-6 border-b border-neutral-100 dark:border-white/5 flex items-center justify-between bg-white dark:bg-[#020617]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-xl">
                                    <ActivityIcon className="h-5 w-5 text-blue-500" />
                                </div>
                                <h2 className="text-xl font-black uppercase tracking-tighter dark:text-white">Activity Feed</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-xl transition transition-colors"
                            >
                                <X className="h-5 w-5 dark:text-neutral-400" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {isLoading ? (
                                <div className="space-y-6">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="flex gap-4 animate-pulse">
                                            <div className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-white/5 shrink-0" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-neutral-200 dark:bg-white/5 rounded w-3/4" />
                                                <div className="h-3 bg-neutral-100 dark:bg-white/5 rounded w-1/2" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : activities.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-30">
                                    <ActivityIcon className="h-12 w-12 text-neutral-400" />
                                    <p className="font-black uppercase tracking-widest text-xs">No activity detected yet</p>
                                </div>
                            ) : (
                                activities.map((activity, index) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        key={activity.id}
                                        className="flex gap-4 group"
                                    >
                                        <div className="relative shrink-0">
                                            {activity.user.avatarUrl ? (
                                                <img src={activity.user.avatarUrl} className="h-10 w-10 rounded-full border-2 border-white dark:border-white/10 shadow-sm" />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-white/10 shadow-lg group-hover:scale-110 transition-transform">
                                                    <User className="h-5 w-5" />
                                                </div>
                                            )}
                                            {index !== activities.length - 1 && (
                                                <div className="absolute top-10 bottom-[-32px] left-1/2 -translate-x-1/2 w-0.5 bg-neutral-100 dark:bg-white/5" />
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm dark:text-neutral-200 leading-snug">
                                                <span className="font-bold text-neutral-900 dark:text-white">{activity.user.name}</span>
                                                <span className="ml-1.5 text-neutral-600 dark:text-neutral-400 font-medium">
                                                    {generateActionText(activity)}
                                                </span>
                                            </p>
                                            <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-bold uppercase tracking-tighter">
                                                <Clock className="h-3 w-3" />
                                                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        <div className="p-6 border-t border-neutral-100 dark:border-white/5 bg-neutral-50/50 dark:bg-black/20">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 text-center">
                                Audit Log Source: Prisma Engine
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
