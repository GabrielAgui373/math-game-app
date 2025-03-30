"use client";

import React, { useEffect, useState, createContext, useContext } from "react";

type Settings = {
  soundEnabled: boolean;
  timeInSeconds: number;
};

type SettingsContextType = {
  settings: Settings;
  toggleSound: () => void;
  updateTime: (seconds: number) => void;
};

const defaultSettings: Settings = {
  soundEnabled: true,
  timeInSeconds: 120,
};

type SettingsProviderProps = {
  children: React.ReactNode;
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load settings from localStorage on initial render
  useEffect(() => {
    loadSettings();
  }, []);

  const toggleSound = () => {
    setSettings((prev) => ({
      ...prev,
      soundEnabled: !prev.soundEnabled,
    }));
  };

  const updateTime = (seconds: number) => {
    setSettings((prev) => ({
      ...prev,
      timeInSeconds: seconds,
    }));
  };

  const saveSettings = () => {
    localStorage.setItem("appSettings", JSON.stringify(settings));
  };

  const loadSettings = () => {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("appSettings");

      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings) as Settings;
          setSettings(parsedSettings);
        } catch (error) {
          console.error("Failed to parse saved settings", error);

          localStorage.setItem("appSettings", JSON.stringify(defaultSettings));
          setSettings(defaultSettings);
        }
      } else {
        localStorage.setItem("appSettings", JSON.stringify(defaultSettings));
        setSettings(defaultSettings);
      }
    } else {
      // Fallback for SSR (Server-Side Rendering)
      setSettings(defaultSettings);
    }
  };

  useEffect(() => {
    saveSettings();
  }, [settings]); // Save whenever settings are changed

  return (
    <SettingsContext.Provider
      value={{
        settings,
        toggleSound,
        updateTime,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
