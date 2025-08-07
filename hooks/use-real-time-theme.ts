"use client";
import { useEffect, useRef } from "react";
import { useTheme } from "@/context/theme-provider";

export function useRealTimeTheme() {
  const { customization } = useTheme();
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Debounce theme updates to avoid performance issues
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      // Apply real-time CSS updates
      const root = document.documentElement;
      
      // Update CSS custom properties
      Object.entries(customization.colors).forEach(([key, value]) => {
        root.style.setProperty(`--theme-color-${key}`, value);
      });

      root.style.setProperty("--theme-border-radius", customization.borderRadius);
      root.style.setProperty("--theme-font-primary", customization.fonts.primary);
      root.style.setProperty("--theme-font-secondary", customization.fonts.secondary);

      // Update spacing
      Object.entries(customization.spacing).forEach(([key, value]) => {
        root.style.setProperty(`--theme-spacing-${key}`, value);
      });

      // Apply background type
      if (customization.backgroundType === "gradient") {
        root.style.setProperty(
          "--theme-background-gradient",
          `linear-gradient(135deg, ${customization.gradientColors?.[0] || customization.colors.primary}, ${customization.gradientColors?.[1] || customization.colors.accent})`
        );
      }

      if (customization.backgroundType === "blur") {
        root.style.setProperty("--theme-blur-intensity", `${customization.blurIntensity || 10}px`);
      }

      // Trigger a custom event for components that need to react to theme changes
      window.dispatchEvent(new CustomEvent("themeUpdate", { 
        detail: { customization } 
      }));
    }, 100);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [customization]);

  return customization;
}

export function useThemeAnimation() {
  const { customization } = useTheme();

  const getAnimationProps = (animationType: "fadeIn" | "slideUp" | "scaleIn" = "fadeIn") => {
    const baseProps = {
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    };

    switch (animationType) {
      case "fadeIn":
        return {
          ...baseProps,
          opacity: 0,
          animation: "fadeIn 0.3s ease-in-out forwards",
        };
      case "slideUp":
        return {
          ...baseProps,
          transform: "translateY(20px)",
          opacity: 0,
          animation: "slideUp 0.3s ease-out forwards",
        };
      case "scaleIn":
        return {
          ...baseProps,
          transform: "scale(0.95)",
          opacity: 0,
          animation: "scaleIn 0.2s ease-out forwards",
        };
      default:
        return baseProps;
    }
  };

  const getThemeStyles = () => ({
    backgroundColor: customization.colors.surface,
    color: customization.colors.text,
    borderColor: customization.colors.border,
    borderRadius: customization.borderRadius,
    fontFamily: customization.fonts.primary,
  });

  return {
    getAnimationProps,
    getThemeStyles,
    customization,
  };
}
