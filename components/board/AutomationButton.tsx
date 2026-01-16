import { useModalStore } from "@/lib/store/useModalStore";
import { Zap } from "lucide-react";

interface AutomationButtonProps {
    boardId: string;
    rules: any[];
}

export const AutomationButton = ({ boardId, rules }: AutomationButtonProps) => {
    const { onOpenAutomation } = useModalStore();

    return (
        <button
            onClick={() => onOpenAutomation(boardId, rules)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition shadow-lg"
        >
            <Zap className="h-4 w-4" />
            Automation
            {rules.length > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {rules.length}
                </span>
            )}
        </button>
    );
};
