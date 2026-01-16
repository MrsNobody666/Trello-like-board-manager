"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
    onSearchChange: (query: string) => void;
    placeholder?: string;
}

export const SearchBar = ({ onSearchChange, placeholder = "Search cards..." }: SearchBarProps) => {
    const [query, setQuery] = useState("");

    const handleChange = (value: string) => {
        setQuery(value);
        onSearchChange(value);
    };

    const handleClear = () => {
        setQuery("");
        onSearchChange("");
    };

    return (
        <div className="relative w-full max-w-md">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-2 bg-white/90 dark:bg-black/20 border border-white/20 rounded-lg text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition"
                />
                {query && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
};
