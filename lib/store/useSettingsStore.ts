import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
    // Profile
    firstName: string;
    lastName: string;
    email: string;
    bio: string;

    // Preferences
    theme: string;
    accentColor: string;
    compactMode: boolean;

    // Notifications
    emailAlerts: boolean;
    pushNotifications: boolean;
    activitySummaries: boolean;

    // Security
    twoFactor: boolean;

    // Actions
    updateSettings: (settings: Partial<Omit<SettingsState, 'updateSettings'>>) => void;
    setTheme: (theme: string) => void;
    setCompactMode: (compact: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            firstName: "User",
            lastName: "Name",
            email: "user@tasker.ai",
            bio: "Digital minimalist, productivity seeker, and lifelong learner.",
            theme: 'dark',
            accentColor: "#3b82f6",
            compactMode: false,
            emailAlerts: true,
            pushNotifications: true,
            activitySummaries: false,
            twoFactor: false,

            updateSettings: (newSettings) => set((state) => ({ ...state, ...newSettings })),
            setTheme: (theme) => set({ theme }),
            setCompactMode: (compactMode) => set({ compactMode }),
        }),
        {
            name: 'taskmaster-settings-storage',
        }
    )
);
