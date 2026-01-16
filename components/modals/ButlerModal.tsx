"use client";

import { useState } from "react";
import { X, Zap, Plus, Trash, Play, Settings2, Shield, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { createAutomationRule, deleteAutomationRule, toggleAutomationRule } from "@/actions/automation";
import { AutomationTrigger, AutomationAction } from "@/lib/automation";

interface ButlerModalProps {
    boardId: string;
    rules: any[];
    onClose: () => void;
}

export const ButlerModal = ({ boardId, rules, onClose }: ButlerModalProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [name, setName] = useState("");
    const [triggerType, setTriggerType] = useState<AutomationTrigger>("card_created");
    const [conditions, setConditions] = useState<any>({});
    const [actions, setActions] = useState<any[]>([]);

    const handleCreate = async () => {
        if (!name || actions.length === 0) return;
        await createAutomationRule(boardId, name, triggerType, JSON.stringify(conditions), actions);
        setIsCreating(false);
        setName("");
        setActions([]);
        setConditions({});
    };

    const addAction = (type: string) => {
        setActions([...actions, { type, data: {} }]);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="bg-[#020617] border border-blue-500/20 w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-[0_0_50px_rgba(59,130,246,0.15)] overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-8 border-b border-blue-500/10 flex items-center justify-between bg-gradient-to-r from-blue-600/5 to-transparent">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                            <Zap className="h-6 w-6 text-white animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">Butler Engine</h2>
                            <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.3em] opacity-60">Automation Command Center</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 text-neutral-500 hover:text-white transition-all">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {!isCreating ? (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500">Active Directives</h3>
                                <button
                                    onClick={() => setIsCreating(true)}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center gap-2"
                                >
                                    <Plus className="h-4 w-4" /> New Protocol
                                </button>
                            </div>

                            <div className="grid gap-4">
                                {rules.map((rule) => {
                                    const parsedActions = JSON.parse(rule.actions);
                                    return (
                                        <div key={rule.id} className="p-6 rounded-3xl bg-blue-600/5 border border-blue-500/10 flex items-center justify-between group hover:border-blue-500/30 transition-all">
                                            <div className="flex items-center gap-6">
                                                <div className={cn(
                                                    "h-3 w-3 rounded-full shadow-[0_0_10px_currentColor]",
                                                    rule.enabled ? "text-emerald-500 bg-emerald-500" : "text-neutral-600 bg-neutral-600"
                                                )} />
                                                <div>
                                                    <p className="text-sm font-bold text-white mb-1">{rule.name}</p>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-blue-400/60 bg-blue-400/5 px-2 py-0.5 rounded-md border border-blue-400/10">
                                                            {rule.triggerType}
                                                        </span>
                                                        <span className="text-neutral-600">→</span>
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
                                                            {parsedActions.length} Actions
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => toggleAutomationRule(rule.id, !rule.enabled, boardId)}
                                                    className="p-2 hover:bg-white/5 rounded-xl transition-colors text-neutral-400 hover:text-white"
                                                >
                                                    <Play className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteAutomationRule(rule.id, boardId)}
                                                    className="p-2 hover:bg-red-500/10 rounded-xl transition-colors text-neutral-400 hover:text-red-500"
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                                {rules.length === 0 && (
                                    <div className="p-12 border-2 border-dashed border-blue-500/10 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-4">
                                        <Shield className="h-12 w-12 text-blue-500/20" />
                                        <p className="text-sm font-bold text-neutral-500">No automation protocols active in this sector.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-10 max-w-2xl mx-auto">
                            <div className="space-y-4 text-center">
                                <h3 className="text-xl font-black text-white italic">Design New Protocol</h3>
                                <p className="text-xs text-neutral-500 uppercase tracking-widest">Define the Trigger, Condition, and Strategic Outcome</p>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-blue-400">Directive Name</label>
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g., Auto-Label Critical Tasks"
                                        className="w-full bg-black/40 border border-blue-500/20 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-400">Trigger Event</label>
                                        <select
                                            value={triggerType}
                                            onChange={(e) => setTriggerType(e.target.value as any)}
                                            className="w-full bg-black/40 border border-blue-500/20 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all appearance-none font-bold"
                                        >
                                            <option value="card_created">Card Created</option>
                                            <option value="card_moved">Card Moved</option>
                                            <option value="due_date_reached">Due Date Reached</option>
                                            <option value="label_added">Label Added</option>
                                            <option value="checklist_completed">Checklist Finished</option>
                                        </select>
                                    </div>

                                    {triggerType === "card_moved" && (
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-blue-500 animate-pulse">Condition: Target List</label>
                                            <input
                                                value={conditions.to_list || ""}
                                                onChange={(e) => setConditions({ ...conditions, to_list: e.target.value })}
                                                placeholder="e.g., Done"
                                                className="w-full bg-blue-500/5 border border-blue-500/30 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-400">Actions Sequence</label>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => addAction("post_comment")}
                                                className="text-[9px] font-black px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all uppercase tracking-widest"
                                            >
                                                + Comment
                                            </button>
                                            <button
                                                onClick={() => addAction("set_due_complete")}
                                                className="text-[9px] font-black px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all uppercase tracking-widest"
                                            >
                                                + Mark Complete
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {actions.map((action, idx) => (
                                            <div key={idx} className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-4 group/action">
                                                <div className="text-[10px] font-black uppercase tracking-widest text-blue-500/40 w-16">
                                                    Action {idx + 1}
                                                </div>
                                                <select
                                                    value={action.type}
                                                    onChange={(e) => {
                                                        const newActions = [...actions];
                                                        newActions[idx].type = e.target.value as any;
                                                        setActions(newActions);
                                                    }}
                                                    className="bg-transparent text-sm font-black text-white outline-none w-40"
                                                >
                                                    <option value="post_comment">Celebrate/Comment</option>
                                                    <option value="set_due_complete">Set Complete</option>
                                                    <option value="add_label">Apply Label</option>
                                                    <option value="move_card">Reassign List</option>
                                                    <option value="archive_card">Archive Unit</option>
                                                </select>

                                                {(action.type === "post_comment" || action.type === "add_comment") && (
                                                    <input
                                                        placeholder="Write protocol message..."
                                                        className="flex-1 bg-transparent text-sm text-neutral-400 outline-none border-b border-white/10 focus:border-blue-500 transition-all px-2 py-1"
                                                        value={action.text || ""}
                                                        onChange={(e) => {
                                                            const newActions = [...actions];
                                                            newActions[idx].text = e.target.value;
                                                            setActions(newActions);
                                                        }}
                                                    />
                                                )}

                                                <button onClick={() => setActions(actions.filter((_, i) => i !== idx))} className="ml-auto text-neutral-600 hover:text-red-500 transition-colors">
                                                    <Trash className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                        {actions.length === 0 && (
                                            <div className="p-8 border border-dashed border-white/5 rounded-3xl text-center">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600">No actions assigned to this protocol.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button
                                        onClick={handleCreate}
                                        className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all active:scale-95"
                                    >
                                        Initialize Protocol
                                    </button>
                                    <button
                                        onClick={() => setIsCreating(false)}
                                        className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-[1.5rem] font-black uppercase tracking-widest transition-all"
                                    >
                                        Abort
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                {!isCreating && (
                    <div className="p-8 bg-black/40 border-t border-blue-500/10 flex items-center gap-3">
                        <Info className="h-4 w-4 text-blue-500" />
                        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                            Butler protocols run instantly when triggers are detected across the tactical board.
                        </p>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};
