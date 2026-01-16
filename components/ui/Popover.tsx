"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface PopoverProps {
    trigger: React.ReactNode;
    content: React.ReactNode;
    align?: "left" | "right" | "center";
    sideOffset?: number;
    className?: string;
}

export const Popover = ({
    trigger,
    content,
    align = "center",
    sideOffset = 5,
    className
}: PopoverProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const toggle = () => setIsOpen(!isOpen);

    const alignmentClasses = {
        left: "left-0",
        right: "right-0",
        center: "left-1/2 -translate-x-1/2"
    };

    return (
        <div className="relative" ref={containerRef}>
            <div onClick={toggle} className="cursor-pointer">
                {trigger}
            </div>

            {isOpen && (
                <div
                    className={cn(
                        "absolute z-50 min-w-[200px] rounded-lg border border-white/10 bg-[#1e2330] p-2 shadow-xl glass-card text-neutral-200 animate-in fade-in zoom-in-95 duration-200",
                        alignmentClasses[align],
                        className
                    )}
                    style={{ top: `calc(100% + ${sideOffset}px)` }}
                >
                    {content}
                </div>
            )}
        </div>
    );
};
