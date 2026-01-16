"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Users, ListTodo, Zap, ArrowRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const PURPOSES = [
    { id: "ideas", icon: ListTodo, label: "Organize ideas and work", color: "#3b82f6" },
    { id: "tasks", icon: CheckCircle2, label: "Track personal tasks and to-dos", color: "#10b981" },
    { id: "team", icon: Users, label: "Manage team projects", color: "#8b5cf6" },
    { id: "automate", icon: Zap, label: "Create and automate workflows", color: "#f59e0b" },
];

const TEMPLATES = [
    {
        id: "personal",
        name: "Personal Tasks",
        color: "#14b8a6",
        lists: ["To Do", "In Progress", "Done"],
        cards: [
            { list: 0, title: "Morning routine", labels: ["#10b981"] },
            { list: 0, title: "Plan family vacation", labels: [] },
            { list: 1, title: "Finish presentation", labels: ["#ef4444"] },
            { list: 2, title: "Send project report", labels: ["#3b82f6"] },
        ],
    },
    {
        id: "team",
        name: "Team Project",
        color: "#3b82f6",
        lists: ["Backlog", "This Week", "In Review", "Complete"],
        cards: [
            { list: 0, title: "User research", labels: ["#8b5cf6"] },
            { list: 1, title: "Design mockups", labels: ["#f59e0b"] },
            { list: 1, title: "API integration", labels: ["#ef4444"] },
            { list: 2, title: "Code review", labels: ["#10b981"] },
        ],
    },
    {
        id: "goals",
        name: "Goal Tracker",
        color: "#8b5cf6",
        lists: ["Goals", "In Progress", "Achieved"],
        cards: [
            { list: 0, title: "Learn TypeScript", labels: ["#3b82f6"] },
            { list: 1, title: "Build side project", labels: ["#f59e0b"] },
            { list: 2, title: "Launch portfolio", labels: ["#10b981"] },
        ],
    },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<string>("personal");
    const [boardName, setBoardName] = useState("My First Board");

    const currentTemplate = TEMPLATES.find((t) => t.id === selectedTemplate) || TEMPLATES[0];

    const handleContinue = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            // Complete onboarding
            router.push("/");
        }
    };

    const handleSkip = () => {
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#f093fb] flex items-center justify-center p-8">
            <div className="w-full max-w-7xl h-[600px] flex rounded-2xl overflow-hidden shadow-2xl">
                {/* Left Panel - Dark */}
                <div className="w-2/5 bg-[#2B2D42] p-12 flex flex-col justify-between">
                    <div>
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h1 className="text-white text-4xl font-bold mb-8">
                                        What brings you here today?
                                    </h1>
                                    <div className="space-y-3">
                                        {PURPOSES.map((purpose) => (
                                            <button
                                                key={purpose.id}
                                                onClick={() => setSelectedPurpose(purpose.id)}
                                                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-4 ${selectedPurpose === purpose.id
                                                        ? "border-blue-400 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                                                        : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                                                    }`}
                                            >
                                                <purpose.icon className="h-5 w-5 text-white/80" />
                                                <span className="text-white font-medium">{purpose.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h1 className="text-white text-4xl font-bold mb-8">
                                        Pick a template to get started
                                    </h1>
                                    <div className="space-y-3">
                                        {TEMPLATES.map((template) => (
                                            <button
                                                key={template.id}
                                                onClick={() => setSelectedTemplate(template.id)}
                                                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${selectedTemplate === template.id
                                                        ? "border-blue-400 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                                                        : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: template.color }}
                                                    />
                                                    <span className="text-white font-medium">{template.name}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h1 className="text-white text-4xl font-bold mb-8">
                                        Name your first board
                                    </h1>
                                    <input
                                        type="text"
                                        value={boardName}
                                        onChange={(e) => setBoardName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg bg-white/10 border-2 border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition"
                                        placeholder="Enter board name..."
                                    />
                                    <p className="text-white/60 text-sm mt-3">
                                        You can always change this later
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Bottom Navigation */}
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    className={`h-2 rounded-full transition-all duration-300 ${s === step ? "w-8 bg-blue-400" : "w-2 bg-white/30"
                                        }`}
                                />
                            ))}
                        </div>
                        <div className="flex gap-3">
                            {step > 1 && (
                                <button
                                    onClick={() => setStep(step - 1)}
                                    className="px-4 py-2 text-white/70 hover:text-white transition flex items-center gap-2"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Back
                                </button>
                            )}
                            <button
                                onClick={handleSkip}
                                className="px-4 py-2 text-white/70 hover:text-white transition"
                            >
                                Skip
                            </button>
                            <button
                                onClick={handleContinue}
                                disabled={step === 1 && !selectedPurpose}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg font-medium transition shadow-lg shadow-blue-500/30 flex items-center gap-2"
                            >
                                {step === 3 ? "Get Started" : "Continue"}
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Preview */}
                <div className="w-3/5 bg-gradient-to-br from-[#4a5568] to-[#2d3748] p-12 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedTemplate + boardName}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="w-full max-w-2xl"
                        >
                            {/* Mini Board Preview */}
                            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                                {/* Board Header */}
                                <div
                                    className="h-16 flex items-center px-6"
                                    style={{ backgroundColor: currentTemplate.color }}
                                >
                                    <h2 className="text-white font-bold text-lg">{boardName}</h2>
                                </div>

                                {/* Board Content */}
                                <div className="p-6 bg-gradient-to-br from-white to-gray-50 min-h-[400px]">
                                    <div className="flex gap-4 overflow-x-auto pb-4">
                                        {currentTemplate.lists.map((listName, listIdx) => (
                                            <motion.div
                                                key={listIdx}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: listIdx * 0.1 }}
                                                className="flex-shrink-0 w-64 bg-gray-100 rounded-lg p-3"
                                            >
                                                <h3 className="font-semibold text-gray-800 mb-3">{listName}</h3>
                                                <div className="space-y-2">
                                                    {currentTemplate.cards
                                                        .filter((card) => card.list === listIdx)
                                                        .map((card, cardIdx) => (
                                                            <motion.div
                                                                key={cardIdx}
                                                                initial={{ opacity: 0, scale: 0.9 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ delay: listIdx * 0.1 + cardIdx * 0.05 }}
                                                                className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition"
                                                            >
                                                                {card.labels.length > 0 && (
                                                                    <div className="flex gap-1 mb-2">
                                                                        {card.labels.map((color, i) => (
                                                                            <div
                                                                                key={i}
                                                                                className="h-2 w-8 rounded-full"
                                                                                style={{ backgroundColor: color }}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                <p className="text-sm text-gray-700">{card.title}</p>
                                                            </motion.div>
                                                        ))}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Branding */}
                            <div className="text-center mt-6">
                                <p className="text-white/80 text-sm">
                                    Powered by <span className="font-bold">TaskMaster</span>
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
