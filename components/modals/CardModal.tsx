"use client";

import { Card, Label, Checklist } from "@/types";
import { X, CheckSquare, Tag, Clock, Trash, Plus, Calendar, Type, Sparkles, Settings2, Archive } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, ElementRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { updateCard, updateCheckitem, createCheckitem, createChecklist, deleteCard, addCardLabel, removeCardLabel, deleteChecklist, updateCustomFieldValue, archiveCard } from "@/actions/card";
import { assignMember, removeMember } from "@/actions/member";
import { addAttachment, deleteAttachment } from "@/actions/attachment";
import { format, isPast, isToday, addDays } from "date-fns";
import { CommentsActivity } from "./CommentsActivity";
import { CoverSelector } from "./CoverSelector";
import { motion, AnimatePresence } from "framer-motion";
import { Member, Attachment } from "@/types";

interface CardModalProps {
    card: Card;
    boardId: string;
    allLabels: Label[];
}

export const CardModal = ({ card, boardId, allLabels }: CardModalProps) => {
    const router = useRouter();
    const [desc, setDesc] = useState(card.description || "");
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const descRef = useRef<ElementRef<"textarea">>(null);

    const [openPopover, setOpenPopover] = useState<"labels" | "checklist" | "dates" | null>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setOpenPopover(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const onClose = () => router.push(`/board/${boardId}`);

    const onDescSave = async () => {
        await updateCard(card.id, boardId, { description: desc });
        setIsEditingDesc(false);
    };

    const onTitleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.target.value !== card.title) {
            await updateCard(card.id, boardId, { title: e.target.value });
        }
    };

    const onCheckitemToggle = async (itemId: string, checked: boolean) => {
        await updateCheckitem(itemId, boardId, { isChecked: checked });
    };

    const handleDelete = async () => {
        if (confirm("Permanently delete this card?")) {
            await deleteCard(card.id, boardId);
            onClose();
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-2xl"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-[#020617] w-full max-w-5xl rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col max-h-[92vh] overflow-hidden border border-blue-500/20 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Premium Header/Cover Area */}
                <div className="relative h-48 w-full bg-neutral-100 dark:bg-neutral-800 shrink-0">
                    {(card as any).coverImage ? (
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={(card as any).coverImage.startsWith('#') ? { backgroundColor: (card as any).coverImage } : { backgroundImage: `url(${(card as any).coverImage})` }}
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-blue-800/40 to-black/80 opacity-90" />
                    )}

                    <div className="absolute top-6 right-6 flex items-center gap-3">
                        <button onClick={onClose} className="p-3 bg-black/20 hover:bg-black/40 text-white backdrop-blur-md rounded-full transition-all active:scale-90">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="absolute -bottom-8 left-10 p-4 bg-[#030712] rounded-3xl shadow-[0_10px_30px_rgba(59,130,246,0.3)] border border-blue-500/30">
                        <Sparkles className="h-8 w-8 text-blue-400 animate-pulse" />
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col md:flex-row pt-16">
                    {/* Main Interaction Column */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 min-w-0">
                        {/* Title & Context */}
                        <div className="space-y-4">
                            <input
                                defaultValue={card.title}
                                className="text-4xl font-black bg-transparent border-none focus:ring-0 p-0 text-neutral-900 dark:text-white w-full placeholder:text-neutral-300 tracking-tighter leading-tight"
                                placeholder="Mission Title"
                                onBlur={onTitleBlur}
                            />
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
                                    <Calendar className="h-3 w-3" />
                                    Created <span className="text-blue-500">Recently</span>
                                </div>
                                {card.dueDate && (
                                    <div className={cn(
                                        "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg ring-1 ring-white/10",
                                        isPast(new Date(card.dueDate)) ? "bg-red-500/20 text-red-500" :
                                            isToday(new Date(card.dueDate)) ? "bg-yellow-500/20 text-yellow-500" :
                                                "bg-emerald-500/20 text-emerald-500"
                                    )}>
                                        <Clock className="h-3 w-3" />
                                        {format(new Date(card.dueDate), "MMM d")}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Members Display */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Assigned Units</h4>
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2 overflow-hidden">
                                    {card.members && card.members.map(cm => (
                                        <motion.div
                                            whileHover={{ y: -5, scale: 1.1 }}
                                            key={cm.memberId}
                                            className="inline-block h-10 w-10 rounded-full ring-2 ring-[#020617] bg-blue-600 flex items-center justify-center text-xs font-bold relative group"
                                        >
                                            {cm.member.avatarUrl ? (
                                                <img src={cm.member.avatarUrl} alt={cm.member.name} className="h-full w-full object-cover rounded-full" />
                                            ) : (
                                                cm.member.name.charAt(0)
                                            )}
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                                {cm.member.name}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                <button onClick={() => setOpenPopover("members" as any)} className="h-10 w-10 rounded-full bg-blue-500/10 border border-dashed border-blue-500/30 flex items-center justify-center hover:bg-blue-500/20 hover:scale-110 transition-all active:scale-95">
                                    <Plus className="h-4 w-4 text-blue-400" />
                                </button>
                            </div>
                        </div>

                        {/* Classify Section (Labels) */}
                        {card.labels && card.labels.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Classify</h4>
                                <div className="flex flex-wrap gap-2">
                                    {card.labels.map(cl => (
                                        <motion.span
                                            whileHover={{ scale: 1.05 }}
                                            key={cl.labelId}
                                            className="px-4 py-1.5 rounded-full text-[10px] font-black shadow-lg ring-1 ring-white/10 text-white uppercase tracking-widest"
                                            style={{ backgroundColor: cl.label.color }}
                                        >
                                            {cl.label.title}
                                        </motion.span>
                                    ))}
                                    <button onClick={() => setOpenPopover("labels")} className="h-8 w-8 rounded-full bg-neutral-100 dark:bg-black/30 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all active:scale-90 shadow-sm">
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Objective Section (Description) */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-2">
                                <CheckSquare className="h-3 w-3" /> Objective
                            </h4>
                            {isEditingDesc ? (
                                <div className="space-y-4">
                                    <textarea
                                        ref={descRef}
                                        className="w-full min-h-[180px] p-6 rounded-[2rem] bg-black/40 border-2 border-transparent focus:border-blue-500/50 outline-none text-white resize-none transition-all shadow-inner font-medium leading-relaxed"
                                        value={desc}
                                        onChange={(e) => setDesc(e.target.value)}
                                        placeholder="Define mission objective..."
                                    />
                                    <div className="flex gap-3">
                                        <button onClick={onDescSave} className="bg-neutral-900 dark:bg-white text-white dark:text-black px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:brightness-110 transition shadow-xl active:scale-95">Update Objective</button>
                                        <button onClick={() => setIsEditingDesc(false)} className="px-8 py-3 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-full text-xs font-black uppercase tracking-widest transition">Discard</button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    onClick={() => setIsEditingDesc(true)}
                                    className="min-h-[100px] p-8 rounded-[2rem] bg-black/20 hover:bg-black/40 cursor-pointer transition-all text-blue-100/70 leading-loose border border-dashed border-blue-500/10"
                                >
                                    {card.description || "Deploy mission objective here..."}
                                </div>
                            )}
                        </div>

                        {/* Timeline Section (Due Date) */}
                        {card.dueDate && (
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-2">
                                    <Clock className="h-3 w-3" /> Timeline
                                </h4>
                                <div className="flex items-center gap-4 p-4 bg-black/20 rounded-2xl border border-white/5">
                                    <div className="h-10 w-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                                        <Calendar className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{format(new Date(card.dueDate), "PPP")}</p>
                                        <p className="text-[10px] text-neutral-500 uppercase tracking-wider">{isPast(new Date(card.dueDate)) ? "Mission Expired" : "Target Date"}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Custom Fields Section */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 text-neutral-500">
                                <Settings2 className="h-4 w-4" /> Tactical Parameters
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {card.customFields && card.customFields.map(cfv => (
                                    <div key={cfv.id} className="p-4 bg-blue-600/5 rounded-2xl border border-blue-500/10 flex flex-col gap-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-400">{cfv.field.name}</label>
                                        <input
                                            defaultValue={cfv.value || ""}
                                            onBlur={(e) => updateCustomFieldValue(card.id, boardId, cfv.fieldId, e.target.value)}
                                            className="bg-transparent text-sm font-bold text-white outline-none placeholder:text-neutral-700"
                                            placeholder={`Set ${cfv.field.name}...`}
                                        />
                                    </div>
                                ))}
                                {(!card.customFields || card.customFields.length === 0) && (
                                    <div className="col-span-full p-8 border-2 border-dashed border-blue-500/10 rounded-3xl text-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600">No custom parameters defined</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Attachments Section */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 text-neutral-500">
                                <Sparkles className="h-4 w-4" /> Intelligence Assets
                            </h3>

                            <div className="grid gap-4">
                                {card.attachments && card.attachments.length > 0 && card.attachments.map(attachment => (
                                    <motion.div
                                        whileHover={{ x: 10 }}
                                        key={attachment.id}
                                        className="group p-4 bg-black/20 hover:bg-black/40 rounded-3xl border border-blue-500/10 flex items-center justify-between transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-16 bg-blue-600/10 rounded-xl flex items-center justify-center">
                                                <Type className="h-6 w-6 text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">{attachment.name}</p>
                                                <p className="text-[10px] text-blue-400/60 uppercase tracking-widest">{attachment.type}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => deleteAttachment(attachment.id, boardId)} className="p-3 text-neutral-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                            <Trash className="h-4 w-4" />
                                        </button>
                                    </motion.div>
                                ))}
                                <button className="w-full p-8 border-2 border-dashed border-blue-500/10 rounded-[2rem] text-xs font-black uppercase tracking-widest text-blue-400/60 hover:bg-blue-600/5 hover:border-blue-500/30 transition-all flex flex-col items-center gap-3">
                                    <Plus className="h-6 w-6" />
                                    Link Strategic Asset
                                </button>
                            </div>
                        </div>

                        {/* Checklists */}
                        {card.checklists && card.checklists.map(checklist => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={checklist.id}
                                className="bg-white dark:bg-black/10 rounded-[2.5rem] p-8 border border-neutral-100 dark:border-white/5 shadow-2xl space-y-8"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-500/10 rounded-2xl">
                                            <CheckSquare className="h-5 w-5 text-blue-500" />
                                        </div>
                                        <h3 className="text-xl font-black tracking-tight text-neutral-900 dark:text-white uppercase tracking-[0.1em]">{checklist.title}</h3>
                                    </div>
                                    <button
                                        onClick={() => deleteChecklist(checklist.id, boardId)}
                                        className="text-[10px] uppercase tracking-widest font-black text-red-500 hover:underline transition"
                                    >
                                        Purge List
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="relative w-full bg-neutral-100 dark:bg-neutral-800 h-3 rounded-full overflow-hidden shadow-inner border border-neutral-200 dark:border-white/5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${checklist.items.length > 0 ? (checklist.items.filter(i => i.isChecked).length / checklist.items.length) * 100 : 0}%` }}
                                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                        />
                                    </div>

                                    <div className="grid gap-3 pt-4">
                                        {checklist.items.map(item => (
                                            <div key={item.id} className="group flex items-center gap-4 p-4 hover:bg-neutral-50 dark:hover:bg-white/5 rounded-2xl transition-all active:scale-[0.99] border border-transparent hover:border-neutral-100 dark:hover:border-white/10">
                                                <input
                                                    type="checkbox"
                                                    checked={item.isChecked}
                                                    onChange={(e) => onCheckitemToggle(item.id, e.target.checked)}
                                                    className="h-6 w-6 rounded-lg ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-neutral-300 dark:border-neutral-700 bg-transparent transition-all checked:bg-blue-500 cursor-pointer"
                                                />
                                                <span className={`text-sm font-bold flex-1 transition-all ${item.isChecked ? "line-through text-neutral-400 opacity-60" : "text-neutral-700 dark:text-neutral-200"}`}>
                                                    {item.title}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Elite Sidebar */}
                    <div className="w-full md:w-80 bg-neutral-50/50 dark:bg-black/20 p-8 space-y-8 shrink-0 border-l border-white/5 overflow-y-auto">
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em]">Operations</h3>

                            <div className="grid gap-3">
                                <button onClick={() => setOpenPopover("labels")} className="w-full text-left bg-blue-900/10 hover:bg-blue-600/20 hover:scale-[1.02] active:scale-95 border border-blue-500/10 px-6 py-4 rounded-2xl flex items-center gap-4 text-xs font-black uppercase tracking-widest text-white transition-all shadow-xl group">
                                    <Tag className="h-4 w-4 text-blue-400 group-hover:rotate-12 transition-transform" /> Classify
                                </button>

                                <button onClick={() => setOpenPopover("checklist")} className="w-full text-left bg-blue-900/10 hover:bg-blue-600/20 hover:scale-[1.02] active:scale-95 border border-blue-500/10 px-6 py-4 rounded-2xl flex items-center gap-4 text-xs font-black uppercase tracking-widest text-white transition-all shadow-xl group">
                                    <CheckSquare className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" /> Objectives
                                </button>

                                <button onClick={() => setOpenPopover("dates")} className="w-full text-left bg-blue-900/10 hover:bg-blue-600/20 hover:scale-[1.02] active:scale-95 border border-blue-500/10 px-6 py-4 rounded-2xl flex items-center gap-4 text-xs font-black uppercase tracking-widest text-white transition-all shadow-xl group">
                                    <Clock className="h-4 w-4 text-blue-400 group-hover:animate-bounce" /> Timeline
                                </button>

                                <button onClick={() => archiveCard(card.id, boardId)} className="w-full text-left bg-blue-900/10 hover:bg-white/5 hover:scale-[1.02] active:scale-95 border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-4 text-xs font-black uppercase tracking-widest text-white transition-all shadow-xl group">
                                    <Archive className="h-4 w-4 text-neutral-400 group-hover:text-white transition-all" /> Archive Unit
                                </button>

                                <CoverSelector cardId={card.id} boardId={boardId} currentCover={(card as any).coverImage} />
                            </div>
                        </div>

                        <div className="space-y-6 pt-10 border-t border-neutral-200 dark:border-white/5">
                            <h3 className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">Danger Zone</h3>
                            <button onClick={handleDelete} className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-6 py-4 rounded-2xl flex items-center gap-4 text-xs font-black uppercase tracking-widest transition-all shadow-lg group">
                                <Trash className="h-4 w-4 group-hover:animate-wiggle" /> Purge Card
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <style jsx global>{`
                    @keyframes wiggle {
                        0%, 100% { transform: rotate(0deg); }
                        25% { transform: rotate(-10deg); }
                        75% { transform: rotate(10deg); }
                    }
                    .animate-wiggle {
                        animation: wiggle 0.3s ease-in-out infinite;
                    }
                `}</style>
        </motion.div>
    );
};
