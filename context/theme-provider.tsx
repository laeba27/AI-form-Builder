"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export type ThemeType = "light" | "dark";
export type ViewportType = "desktop" | "tablet" | "mobile";

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  border: string;
}

export interface ThemeCustomization {
  colors: ThemeColors;
  fonts: {
    primary: string;
    secondary: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: string;
  backgroundType: "solid" | "gradient" | "blur";
  gradientColors?: string[];
  blurIntensity?: number;
}

interface ThemeContextType {
  theme: ThemeType;
  viewport: ViewportType;
  customization: ThemeCustomization;
  toggleTheme: () => void;
  setViewport: (viewport: ViewportType) => void;
  updateCustomization: (updates: Partial<ThemeCustomization>) => void;
  resetCustomization: () => void;
}

const defaultLightTheme: ThemeCustomization = {
  colors: {
    primary: "#7c3aed",
    secondary: "#a855f7",
    accent: "#ec4899",
    background: "#ffffff",
    surface: "#f8fafc",
    text: "#1e293b",
    border: "#e2e8f0",
  },
  fonts: {
    primary: "Inter, sans-serif",
    secondary: "Roboto, sans-serif",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
  borderRadius: "0.5rem",
  backgroundType: "solid",
  gradientColors: ["#7c3aed", "#ec4899"],
  blurIntensity: 10,
};

const defaultDarkTheme: ThemeCustomization = {
  ...defaultLightTheme,
  colors: {
    primary: "#8b5cf6",
    secondary: "#a78bfa",
    accent: "#f472b6",
    background: "#0f172a",
    surface: "#1e293b",
    text: "#f1f5f9",
    border: "#334155",
  },
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>("light");
  const [viewport, setViewport] = useState<ViewportType>("desktop");
  const [customization, setCustomization] = useState<ThemeCustomization>(defaultLightTheme);

  useEffect(() => {
    const savedTheme = localStorage.getItem("form-builder-theme") as ThemeType;
    const savedCustomization = localStorage.getItem("form-builder-customization");
    
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
    
    if (savedCustomization) {
      try {
        setCustomization(JSON.parse(savedCustomization));
      } catch (e) {
        console.error("Failed to parse saved customization:", e);
      }
    }
  }, []);

  useEffect(() => {
    // Update CSS custom properties when customization changes
    const root = document.documentElement;
    const colors = customization.colors;
    
    root.style.setProperty("--theme-primary", colors.primary);
    root.style.setProperty("--theme-secondary", colors.secondary);
    root.style.setProperty("--theme-accent", colors.accent);
    root.style.setProperty("--theme-background", colors.background);
    root.style.setProperty("--theme-surface", colors.surface);
    root.style.setProperty("--theme-text", colors.text);
    root.style.setProperty("--theme-border", colors.border);
    root.style.setProperty("--theme-font-primary", customization.fonts.primary);
    root.style.setProperty("--theme-font-secondary", customization.fonts.secondary);
    root.style.setProperty("--theme-border-radius", customization.borderRadius);
    
    // Save to localStorage
    localStorage.setItem("form-builder-customization", JSON.stringify(customization));
  }, [customization]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("form-builder-theme", newTheme);
    
    // Update customization based on theme
    setCustomization(newTheme === "dark" ? defaultDarkTheme : defaultLightTheme);
  };

  const updateCustomization = (updates: Partial<ThemeCustomization>) => {
    setCustomization(prev => ({ ...prev, ...updates }));
  };

  const resetCustomization = () => {
    setCustomization(theme === "dark" ? defaultDarkTheme : defaultLightTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        viewport,
        customization,
        toggleTheme,
        setViewport,
        updateCustomization,
        resetCustomization,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
