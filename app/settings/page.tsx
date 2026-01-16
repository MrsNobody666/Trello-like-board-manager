"use client";

import { useState, useEffect } from "react";
import {
    User,
    Bell,
    Shield,
    Palette,
    Globe,
    Mail,
    CreditCard,
    ChevronRight,
    Check,
    Lock,
    Eye,
    EyeOff,
    Smartphone,
    Layout,
    Zap,
    Trash2,
    RefreshCcw,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { SyncManager } from "@/components/settings/SyncManager";
import { useSettingsStore } from "@/lib/store/useSettingsStore";

const SECTIONS = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "integrations", label: "Integrations", icon: Zap },
    { id: "billing", label: "Billing", icon: CreditCard },
];

export default function SettingsPage() {
    const settings = useSettingsStore();
    const [activeSection, setActiveSection] = useState("profile");
    const [isSaved, setIsSaved] = useState(false);

    // We can directly update the store on change, or keep a local "buffer" state if we want "Save" button to commit.
    // Given the prompt impl, it had a SAVE button. Let's keep local buffer to simulate "Check/Save" flow or just auto-save?
    // User expects "Save Changes". Let's use local state initialized from store, then commit on save.
    // BUT, that causes sync issues if store updates elsewhere.
    // BETTER: Auto-save or direct binding is more modern. But the UI has a "Save Changes" button.
    // Let's make "Save Changes" just trigger a "Saved" animation, but actually update store immediately for responsiveness, 
    // OR keep a local draft.
    // Let's go with: Direct update for Theme/Compact (instant feedback), Local draft for text fields.

    const [localState, setLocalState] = useState({
        firstName: settings.firstName,
        lastName: settings.lastName,
        email: settings.email,
        bio: settings.bio,
        // Theme/Compact are live synced via store
    });

    // Update local state if store changes (e.g. initial load)
    useEffect(() => {
        setLocalState({
            firstName: settings.firstName,
            lastName: settings.lastName,
            email: settings.email,
            bio: settings.bio,
        });
    }, [settings.firstName, settings.lastName, settings.email, settings.bio]);

    const handleChange = (key: string, value: any) => {
        // Live update for prefs
        if (["theme", "compactMode", "emailAlerts", "pushNotifications", "activitySummaries", "twoFactor"].includes(key)) {
            settings.updateSettings({ [key]: value });

            // Side effects
            if (key === "theme") {
                if (value === "dark") document.documentElement.classList.add("dark");
                else if (value === "light") document.documentElement.classList.remove("dark");
                else if (value === "system") {
                    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                    document.documentElement.classList.toggle("dark", isDark);
                }
            }
        } else {
            // Draft for text fields
            setLocalState(prev => ({ ...prev, [key]: value }));
        }
    };

    const handleSave = () => {
        // Commit text fields
        settings.updateSettings(localState);

        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const renderSection = () => {
        switch (activeSection) {
            case "profile":
                return (
                    <motion.div
                        key="profile"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center gap-8">
                            <div className="relative group">
                                <div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl border-4 border-white dark:border-[#1e1e1e] group-hover:scale-105 transition-transform duration-500">
                                    {localState.firstName[0]}
                                </div>
                                <button className="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-white/10 hover:text-blue-500 transition-colors">
                                    <RefreshCcw className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black">{localState.firstName} {localState.lastName}</h3>
                                <p className="text-neutral-500 font-medium">Personal Account</p>
                                <div className="flex gap-2 mt-2">
                                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-widest rounded-full">Pro Member</span>
                                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full">Admin</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-neutral-400 uppercase tracking-widest">First Name</label>
                                <input
                                    type="text"
                                    value={localState.firstName}
                                    onChange={(e) => handleChange("firstName", e.target.value)}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-white/5 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-neutral-400 uppercase tracking-widest">Last Name</label>
                                <input
                                    type="text"
                                    value={localState.lastName}
                                    onChange={(e) => handleChange("lastName", e.target.value)}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-white/5 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-bold"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-black text-neutral-400 uppercase tracking-widest">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                                    <input
                                        type="email"
                                        value={localState.email}
                                        onChange={(e) => handleChange("email", e.target.value)}
                                        className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-white/5 rounded-2xl pl-14 pr-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-bold"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-black text-neutral-400 uppercase tracking-widest">Short Bio</label>
                                <textarea
                                    rows={4}
                                    value={localState.bio}
                                    onChange={(e) => handleChange("bio", e.target.value)}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-white/5 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-medium resize-none"
                                />
                            </div>
                        </div>
                    </motion.div>
                );
            case "notifications":
                return (
                    <motion.div
                        key="notifications"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-10"
                    >
                        <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-200 dark:border-blue-800/50 flex items-start gap-4">
                            <div className="h-10 w-10 shrink-0 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                                <Bell className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-black text-blue-900 dark:text-blue-100">Smart Alerts</h4>
                                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium mt-1">We'll notify you about critical deadlines and automated board actions.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {[
                                { id: "emailAlerts", label: "Email Notifications", desc: "Receive updates on board activity via email.", icon: Mail },
                                { id: "pushNotifications", label: "Push Notifications", desc: "Get real-time browser alerts for immediate actions.", icon: Smartphone },
                                { id: "activitySummaries", label: "Weekly Summaries", desc: "A curated digest of your workspace performance.", icon: Globe },
                            ].map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900/30 rounded-2xl transition hover:bg-neutral-100 dark:hover:bg-neutral-900/50">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-white/5 flex items-center justify-center text-neutral-500">
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold">{item.label}</p>
                                            <p className="text-xs text-neutral-500 font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleChange(item.id, !settings[item.id as keyof typeof settings])}
                                        className={cn(
                                            "w-12 h-6 rounded-full transition-all duration-300 relative px-1",
                                            settings[item.id as keyof typeof settings] ? "bg-blue-500" : "bg-neutral-300 dark:bg-neutral-700"
                                        )}
                                    >
                                        <div className={cn(
                                            "h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300 transform",
                                            settings[item.id as keyof typeof settings] ? "translate-x-6" : "translate-x-0"
                                        )} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );
            case "security":
                return (
                    <motion.div
                        key="security"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-10"
                    >
                        <div className="p-8 bg-neutral-900 text-white rounded-3xl relative overflow-hidden group">
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-green-400 font-black text-xs uppercase tracking-widest">
                                        <Shield className="h-4 w-4" />
                                        Locked & Secured
                                    </div>
                                    <h3 className="text-3xl font-black">Account Security</h3>
                                    <p className="text-neutral-400 text-sm font-medium">Your data is encrypted with enterprise-grade standards.</p>
                                </div>
                                <div className="h-24 w-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center animate-pulse">
                                    <Lock className="h-10 w-10 text-white/50" />
                                </div>
                            </div>
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-700" />
                        </div>

                        <div className="space-y-8">
                            <h4 className="font-black text-lg uppercase tracking-wider text-neutral-400">Security Actions</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 rounded-3xl border border-neutral-200 dark:border-white/5 bg-white dark:bg-neutral-900/30 space-y-4">
                                    <div className="h-10 w-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white">
                                        <Eye className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold">Change Password</p>
                                        <p className="text-xs text-neutral-500 font-medium">Update your account credentials</p>
                                    </div>
                                    <button className="w-full py-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-neutral-200 dark:hover:bg-neutral-700 transition">Begin Update</button>
                                </div>
                                <div className="p-6 rounded-3xl border border-neutral-200 dark:border-white/5 bg-white dark:bg-neutral-900/30 space-y-4">
                                    <div className="h-10 w-10 bg-purple-500 rounded-xl flex items-center justify-center text-white">
                                        <Lock className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold">Two-Factor Auth</p>
                                        <p className="text-xs text-neutral-500 font-medium">Add an extra layer of security</p>
                                    </div>
                                    <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition">Enable 2FA</button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case "appearance":
                return (
                    <motion.div
                        key="appearance"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-12"
                    >
                        <div className="space-y-6">
                            <h3 className="text-xl font-black flex items-center gap-3">
                                <Palette className="h-6 w-6 text-purple-500" />
                                Visual Theme
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {["light", "dark", "system"].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => handleChange("theme", t)}
                                        className={cn(
                                            "group p-4 rounded-3xl border-2 transition-all duration-500 relative overflow-hidden",
                                            settings.theme === t ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10" : "border-neutral-200 dark:border-white/5 hover:border-neutral-300 dark:hover:border-white/10"
                                        )}
                                    >
                                        <div className={cn(
                                            "aspect-video rounded-2xl mb-4 p-3 flex flex-col gap-2 shadow-inner",
                                            t === "dark" ? "bg-neutral-900" : "bg-white"
                                        )}>
                                            <div className="h-2 w-full bg-neutral-400/20 rounded" />
                                            <div className="h-4 w-2/3 bg-blue-500/30 rounded" />
                                            <div className="mt-auto h-3 w-3 rounded-full bg-blue-500" />
                                        </div>
                                        <span className={cn(
                                            "text-sm font-black capitalize transition-colors",
                                            settings.theme === t ? "text-neutral-900 dark:text-white" : "text-neutral-400"
                                        )}>{t} Mode</span>
                                        {settings.theme === t && (
                                            <div className="absolute top-2 right-2 h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center shadow-lg transform scale-110">
                                                <Check className="h-3 w-3 text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-black flex items-center gap-3">
                                <Sparkles className="h-6 w-6 text-yellow-500" />
                                Preferences
                            </h3>
                            <div className="flex items-center justify-between p-6 bg-neutral-50 dark:bg-neutral-900/40 rounded-3xl border border-neutral-200 dark:border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-white dark:bg-neutral-800 flex items-center justify-center shadow-sm">
                                        <Layout className="h-6 w-6 text-neutral-500" />
                                    </div>
                                    <div>
                                        <p className="font-bold">Compact Mode</p>
                                        <p className="text-xs text-neutral-500 font-medium">Maximum information density UI</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleChange("compactMode", !settings.compactMode)}
                                    className={cn(
                                        "w-14 h-8 rounded-full transition-all duration-300 relative px-1 flex items-center",
                                        settings.compactMode ? "bg-green-500" : "bg-neutral-300 dark:bg-neutral-700"
                                    )}
                                >
                                    <div className={cn(
                                        "h-6 w-6 rounded-full bg-white shadow-xl transition-all duration-500 transform flex items-center justify-center",
                                        settings.compactMode ? "translate-x-6 rotate-[360deg]" : "translate-x-0"
                                    )}>
                                        {settings.compactMode && <Check className="h-3 w-3 text-green-500" />}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                );
            case "integrations":
                return (
                    <motion.div
                        key="integrations"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-10"
                    >
                        <SyncManager />
                    </motion.div>
                );
            case "billing":
                return (
                    <motion.div
                        key="billing"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-12"
                    >
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1 p-8 rounded-[40px] bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-700 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8">
                                    <Zap className="h-32 w-32 text-white/5 group-hover:scale-150 transition-transform duration-700" />
                                </div>
                                <div className="relative z-10 space-y-8">
                                    <div className="space-y-2">
                                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest">Active Plan</span>
                                        <h3 className="text-4xl font-black">Pro Workspace</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Check className="h-5 w-5 text-blue-300" />
                                            <span className="font-bold">Unlimited Boards & Automations</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Check className="h-5 w-5 text-blue-300" />
                                            <span className="font-bold">Advanced Power-Ups</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Check className="h-5 w-5 text-blue-300" />
                                            <span className="font-bold">24/7 Priority Support</span>
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <button className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-2xl transition active:scale-95">Manage Subscription</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-neutral-100 dark:bg-neutral-900/50 rounded-[40px] border border-neutral-200 dark:border-white/5 space-y-6">
                            <h4 className="text-lg font-black flex items-center gap-2">
                                <CreditCard className="h-6 w-6 text-neutral-400" />
                                Billing History
                            </h4>
                            <div className="space-y-4">
                                {[
                                    { id: "1", date: "Jan 15, 2026", amount: "$12.00", status: "Paid" },
                                    { id: "2", date: "Dec 15, 2025", amount: "$12.00", status: "Paid" },
                                    { id: "3", date: "Nov 15, 2025", amount: "$12.00", status: "Paid" },
                                ].map(row => (
                                    <div key={row.id} className="flex items-center justify-between p-4 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-100 dark:border-white/5">
                                        <div>
                                            <p className="font-bold">{row.date}</p>
                                            <p className="text-xs text-neutral-500 font-medium">Monthly Pro Subscription</p>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className="font-black text-neutral-900 dark:text-white">{row.amount}</span>
                                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-tighter rounded-full">{row.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={cn(
            "max-w-7xl mx-auto space-y-12 pb-32 transition-all duration-500",
            settings.compactMode ? "p-4 space-y-6" : "p-8 space-y-12"
        )}>
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className={cn(
                        "font-[1000] tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-500 transition-all",
                        settings.compactMode ? "text-4xl" : "text-6xl"
                    )}>
                        Settings
                    </h1>
                    {!settings.compactMode && (
                        <p className="text-lg text-neutral-500 dark:text-neutral-400 font-bold tracking-tight">
                            Power up your workflow. Refine your experience.
                        </p>
                    )}
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            localStorage.removeItem("taskmaster-settings-storage");
                            window.location.reload();
                        }}
                        className="px-6 py-3 text-sm font-black text-neutral-400 uppercase tracking-widest hover:text-red-500 transition-colors"
                    >
                        Reset Defaults
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaved}
                        className={cn(
                            "px-10 py-3 rounded-2xl text-sm font-black uppercase tracking-[0.2em] transition-all duration-500 min-w-[180px] flex items-center justify-center gap-3",
                            isSaved
                                ? "bg-green-600 text-white shadow-green-500/40"
                                : "bg-blue-600 text-white hover:bg-blue-700 shadow-2xl shadow-blue-500/20 active:scale-95"
                        )}
                    >
                        {isSaved ? (
                            <>
                                <Check className="h-5 w-5" />
                                Secured
                            </>
                        ) : "Save Changes"}
                    </button>
                </div>
            </header>

            <div className={cn(
                "flex flex-col lg:flex-row pt-4 transition-all duration-500",
                settings.compactMode ? "gap-6" : "gap-12"
            )}>
                {/* Sidebar Navigation */}
                <div className={cn(
                    "w-full lg:w-80 space-y-2 sticky top-8 transition-all",
                    settings.compactMode && "lg:w-64"
                )}>
                    {SECTIONS.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={cn(
                                "w-full flex items-center justify-between group rounded-[2rem] text-sm font-black transition-all duration-500",
                                activeSection === section.id
                                    ? "bg-white dark:bg-[#1e1e1e] text-blue-600 dark:text-blue-400 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] border border-neutral-100 dark:border-white/5"
                                    : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900/50 hover:px-8",
                                settings.compactMode ? "px-5 py-3 rounded-2xl" : "px-6 py-5"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "p-3 rounded-2xl transition-all duration-500",
                                    activeSection === section.id ? "bg-blue-600 text-white" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700"
                                )}>
                                    <section.icon className="h-5 w-5" />
                                </div>
                                <span className="uppercase tracking-[0.1em]">{section.label}</span>
                            </div>
                            <ChevronRight className={cn(
                                "h-5 w-5 transition-all duration-500",
                                activeSection === section.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                            )} />
                        </button>
                    ))}

                    <div className="mt-12 p-8 bg-neutral-900 rounded-[3rem] text-white relative overflow-hidden group">
                        <div className="relative z-10 space-y-4">
                            <h5 className="font-black text-xs uppercase tracking-widest text-blue-400">Pro Feature</h5>
                            <p className="font-bold text-sm leading-relaxed">Sync your boards with GitHub & Slack.</p>
                            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-neutral-400 hover:text-white transition">
                                Connect Now
                                <ChevronRight className="h-3 w-3" />
                            </button>
                        </div>
                        <Zap className="absolute -bottom-6 -right-6 h-32 w-32 text-white/5 rotate-12 group-hover:scale-125 transition-transform duration-700" />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 min-h-[700px]">
                    <AnimatePresence mode="wait">
                        {renderSection()}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
