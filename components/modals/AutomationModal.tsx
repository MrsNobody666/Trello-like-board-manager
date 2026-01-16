"use client";

import { useState } from "react";
import { Zap, Plus, Trash2, Power, PowerOff, Sparkles, Loader2 } from "lucide-react";
import { toggleAutomationRule as toggleRuleAction, deleteAutomationRule as deleteRuleAction, createAutomationRule } from "@/actions/automation";
import { generateRuleFromPrompt } from "@/actions/ai";

interface AutomationRule {
    id: string;
    name: string;
    enabled: boolean;
    triggerType: string;
    actions: string;
}

interface AutomationModalProps {
    boardId: string;
    rules: AutomationRule[];
    onClose: () => void;
}

export const AutomationModal = ({ boardId, rules, onClose }: AutomationModalProps) => {
    const [localRules, setLocalRules] = useState(rules);

    const toggleRule = async (ruleId: string) => {
        const rule = localRules.find(r => r.id === ruleId);
        if (!rule) return;

        const newEnabled = !rule.enabled;

        // Optimistic update
        setLocalRules(prev => prev.map(r =>
            r.id === ruleId ? { ...r, enabled: newEnabled } : r
        ));

        await toggleRuleAction(ruleId, newEnabled, boardId);
    };

    const deleteRule = async (ruleId: string) => {
        if (!confirm("Are you sure you want to delete this rule?")) return;

        // Optimistic update
        setLocalRules(prev => prev.filter(r => r.id !== ruleId));

        await deleteRuleAction(ruleId, boardId);
    };

    const getTriggerLabel = (triggerType: string) => {
        const labels: Record<string, string> = {
            card_created: "When a card is created",
            card_moved: "When a card is moved",
            card_completed: "When a card is completed",
        };
        return labels[triggerType] || triggerType;
    };

    const getActionSummary = (actionsJson: string) => {
        try {
            const actions = JSON.parse(actionsJson);
            return actions.map((a: any) => {
                if (a.type === "add_checklist") return `Add "${a.data.title}" checklist`;
                if (a.type === "add_label") return "Add label";
                if (a.type === "set_due_date") return "Set due date";
                return a.type;
            }).join(", ");
        } catch {
            return "Unknown actions";
        }
    };

    const [isCreating, setIsCreating] = useState(false);
    const [newRule, setNewRule] = useState({
        name: "",
        triggerType: "card_moved",
        actionType: "add_comment",
        actionData: "" // e.g. comment text
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const [magicPrompt, setMagicPrompt] = useState("");
    const [showMagicInput, setShowMagicInput] = useState(false);

    const handleMagicBuild = async () => {
        if (!magicPrompt) return;
        setIsGenerating(true);
        try {
            const rule = await generateRuleFromPrompt(magicPrompt);
            if (rule) {
                setNewRule({
                    name: rule.name || "AI Generated Rule",
                    triggerType: rule.triggerType || "card_moved",
                    actionType: rule.actions?.[0]?.type || "add_comment",
                    actionData: rule.actions?.[0]?.data?.text || ""
                });
                setShowMagicInput(false);
            }
        } catch (error) {
            console.error(error);
            alert("AI Generation failed. Please check API Key.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCreateRule = async () => {
        if (!newRule.name || !newRule.actionData) return;

        const actionPayload = [{
            type: newRule.actionType,
            data: newRule.actionType === "add_comment" ? { text: newRule.actionData } : {}
        }];

        await createAutomationRule(boardId, newRule.name, newRule.triggerType, "{}", actionPayload);

        // Reset form and exit creation mode
        setNewRule({
            name: "",
            triggerType: "card_moved",
            actionType: "add_comment",
            actionData: ""
        });
        setIsCreating(false);
        // Assuming the createRuleAction revalidates data or parent component re-fetches rules
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm bg-black/40 animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl max-h-[85vh] bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Elite Header */}
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-purple-900/20 via-transparent to-transparent">
                    <div className="flex items-center gap-6">
                        <div className="h-14 w-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shadow-[0_0_20px_-5px_rgba(168,85,247,0.3)]">
                            <Zap className="h-7 w-7 text-purple-400" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black text-white tracking-tight">
                                {isCreating ? "New Protocol" : "Automation Protocol"}
                            </h2>
                            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
                                {isCreating ? "Configure Sequence" : `${localRules.length} Active ${localRules.length === 1 ? 'Sequence' : 'Sequences'}`}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-10 w-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors group"
                    >
                        <Trash2 className="h-5 w-5 text-neutral-500 group-hover:text-white transition-colors rotate-45" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">


                    return (
                    // ... structure matches previous ...
                    {isCreating ? (
                        <div className="space-y-6 max-w-2xl mx-auto">

                            {/* AI Magic Build Toggle */}
                            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-purple-500/20 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-purple-400" />
                                        <h3 className="font-bold text-white">Magic Build</h3>
                                    </div>
                                    <button
                                        onClick={() => setShowMagicInput(!showMagicInput)}
                                        className="text-xs text-purple-400 hover:text-purple-300 font-bold uppercase tracking-wider"
                                    >
                                        {showMagicInput ? "Use Manual Mode" : "Use AI Assistant"}
                                    </button>
                                </div>

                                {showMagicInput ? (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                        <textarea
                                            value={magicPrompt}
                                            onChange={(e) => setMagicPrompt(e.target.value)}
                                            className="w-full h-24 bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium text-sm resize-none"
                                            placeholder="Describe your rule, e.g., 'When a checklist is completed, archive the card'"
                                        />
                                        <button
                                            onClick={handleMagicBuild}
                                            disabled={isGenerating}
                                            className="w-full py-3 bg-white text-black hover:bg-neutral-200 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                                        >
                                            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                            Generate Configuration
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-sm text-neutral-500">
                                        Tap "Use AI Assistant" to generate rules from natural language instantly.
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Protocol Name</label>
                                <input
                                    value={newRule.name}
                                    onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium"
                                    placeholder="e.g. Auto-response for Urgent Tasks"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Trigger Event</label>
                                    <select
                                        value={newRule.triggerType}
                                        onChange={(e) => setNewRule({ ...newRule, triggerType: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all [&>option]:bg-neutral-900"
                                    >
                                        <option value="card_moved">Card Moved</option>
                                        <option value="card_created">Card Created</option>
                                        <option value="checklist_completed">Checklist Completed</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Action Type</label>
                                    <select
                                        value={newRule.actionType}
                                        onChange={(e) => setNewRule({ ...newRule, actionType: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all [&>option]:bg-neutral-900"
                                    >
                                        <option value="add_comment">Add Comment</option>
                                        <option value="add_label">Add Label (Default)</option>
                                        <option value="archive_card">Archive Card</option>
                                    </select>
                                </div>
                            </div>

                            {newRule.actionType === "add_comment" && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Comment Text</label>
                                    <textarea
                                        value={newRule.actionData}
                                        onChange={(e) => setNewRule({ ...newRule, actionData: e.target.value })}
                                        className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium resize-none"
                                        placeholder="Enter the automated comment..."
                                    />
                                </div>
                            )}

                            <div className="pt-6 flex items-center gap-4">
                                <button
                                    onClick={() => setIsCreating(false)}
                                    className="px-6 py-3 hover:bg-white/5 text-neutral-400 hover:text-white rounded-xl font-bold text-sm transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={async () => {
                                        if (!newRule.name) return;

                                        const actionPayload = [{
                                            type: newRule.actionType,
                                            data: newRule.actionType === "add_comment" ? { text: newRule.actionData } : {}
                                        }];

                                        // Create Optimistic ID
                                        const tempId = Math.random().toString();
                                        const optimRule = {
                                            id: tempId,
                                            name: newRule.name,
                                            enabled: true,
                                            triggerType: newRule.triggerType,
                                            actions: JSON.stringify(actionPayload)
                                        };

                                        setLocalRules(prev => [...prev, optimRule]);
                                        setIsCreating(false);

                                        await createAutomationRule(
                                            boardId,
                                            newRule.name,
                                            newRule.triggerType,
                                            "{}",
                                            actionPayload
                                        );
                                    }}
                                    className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-sm shadow-[0_0_20px_-5px_rgba(168,85,247,0.5)] transition-all transform active:scale-95"
                                >
                                    Initialize Protocol
                                </button>
                            </div>
                        </div>
                    ) : (
                        localRules.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-6">
                                <div className="h-24 w-24 bg-white/5 rounded-full flex items-center justify-center animate-pulse">
                                    <Zap className="h-10 w-10 text-neutral-600" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-white">No Active Protocols</h3>
                                    <p className="text-neutral-500 max-w-xs mx-auto text-sm leading-relaxed">
                                        Initiate automation sequences to streamline your workflow operations.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsCreating(true)}
                                    className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_-5px_rgba(168,85,247,0.5)] hover:shadow-purple-500/30 hover:scale-105 active:scale-95 flex items-center gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Initialize New Rule
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                <button
                                    onClick={() => setIsCreating(true)}
                                    className="w-full py-4 border-2 border-dashed border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 rounded-3xl text-neutral-400 hover:text-purple-400 font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 group"
                                >
                                    <Plus className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                    Define New Protocol
                                </button>
                                {localRules.map((rule) => (
                                    <div
                                        key={rule.id}
                                        className={`group relative p-6 rounded-3xl border transition-all duration-300 ${rule.enabled
                                            ? 'bg-purple-500/5 border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/10'
                                            : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10 opacity-70'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-6">
                                            <div className="flex-1 space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="font-bold text-lg text-white tracking-tight">
                                                        {rule.name}
                                                    </h3>
                                                    {rule.enabled ? (
                                                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-wider rounded-full ring-1 ring-green-500/20 shadow-[0_0_10px_-3px_rgba(34,197,94,0.3)]">
                                                            Online
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 bg-neutral-500/20 text-neutral-400 text-[10px] font-black uppercase tracking-wider rounded-full ring-1 ring-white/10">
                                                            Offline
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-3 text-sm text-neutral-400 bg-black/20 p-3 rounded-xl border border-white/5 w-fit">
                                                    <span className="font-bold text-purple-400">{getTriggerLabel(rule.triggerType)}</span>
                                                    <span className="text-neutral-600">⟶</span>
                                                    <span className="font-medium text-neutral-300">{getActionSummary(rule.actions)}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => toggleRule(rule.id)}
                                                    className={`p-3 rounded-xl transition-all ${rule.enabled
                                                        ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                                                        : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                                                        }`}
                                                    title={rule.enabled ? "Deactivate Protocol" : "Activate Protocol"}
                                                >
                                                    {rule.enabled ? <Power className="h-5 w-5 shadow-[0_0_10px_rgba(168,85,247,0.5)]" /> : <PowerOff className="h-5 w-5" />}
                                                </button>
                                                <button
                                                    onClick={() => deleteRule(rule.id)}
                                                    className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-all"
                                                    title="Purge Protocol"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Decoration */}
                                        {rule.enabled && (
                                            <div className="absolute -left-[1px] top-8 bottom-8 w-[3px] bg-purple-500 rounded-r-full shadow-[0_0_10px_#a855f7]" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-black/20 flex items-center justify-between">
                    <p className="text-xs font-medium text-neutral-500 flex items-center gap-2">
                        <Zap className="h-3 w-3" />
                        Automated systems operational
                    </p>
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                    >
                        Close Terminal
                    </button>
                </div>
            </div>
        </div>
    );
};
