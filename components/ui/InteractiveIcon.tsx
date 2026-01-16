"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import React from "react";

interface InteractiveIconProps extends React.HTMLAttributes<HTMLDivElement> {
    icon: LucideIcon;
    size?: "sm" | "md" | "lg";
    active?: boolean;
    label?: string; // Optional tooltip/label
}

export const InteractiveIcon = ({
    icon: Icon,
    size = "md",
    active,
    className,
    label,
    ...props
}: InteractiveIconProps) => {

    const sizeClasses = {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12"
    };

    const iconSizes = {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6"
    };

    return (
        <div
            className={cn(
                "ios-icon flex items-center justify-center rounded-xl cursor-pointer transition-all duration-300",
                "bg-white/5 hover:bg-white/10 border border-white/5",
                active ? "bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "text-neutral-400 hover:text-white",
                sizeClasses[size],
                className
            )}
            {...props}
        >
            <Icon className={cn(iconSizes[size])} strokeWidth={2} />
            {label && <span className="sr-only">{label}</span>}
        </div>
    );
};
