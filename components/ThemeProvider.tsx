"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/lib/store/useSettingsStore";

export const ThemeProvider = () => {
    const { theme } = useSettingsStore();

    useEffect(() => {
        const applyTheme = (t: string) => {
            if (t === "dark") {
                document.documentElement.classList.add("dark");
            } else if (t === "light") {
                document.documentElement.classList.remove("dark");
            } else if (t === "system") {
                const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                document.documentElement.classList.toggle("dark", isDark);
            }
        };

        applyTheme(theme);

        // Listen for system changes if in system mode
        if (theme === "system") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            const handleChange = (e: MediaQueryListEvent) => {
                document.documentElement.classList.toggle("dark", e.matches);
            };
            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        }
    }, [theme]);

    return null;
};
