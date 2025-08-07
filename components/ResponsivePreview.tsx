"use client";
import React from "react";
import { useTheme } from "@/context/theme-provider";
import { cn } from "@/lib/utils";

interface ResponsivePreviewProps {
  children: React.ReactNode;
  className?: string;
}

const ResponsivePreview: React.FC<ResponsivePreviewProps> = ({ children, className }) => {
  const { viewport, customization } = useTheme();

  const getViewportStyles = () => {
    switch (viewport) {
      case "mobile":
        return {
          width: "375px",
          height: "667px",
          maxWidth: "100%",
          maxHeight: "80vh",
        };
      case "tablet":
        return {
          width: "768px",
          height: "1024px",
          maxWidth: "100%",
          maxHeight: "80vh",
        };
      case "desktop":
        return {
          width: "100%",
          height: "100%",
        };
      default:
        return {
          width: "100%",
          height: "100%",
        };
    }
  };

  const getContainerStyles = () => {
    const base = {
      transition: "all 0.3s ease-in-out",
      borderRadius: customization.borderRadius,
      fontFamily: customization.fonts.primary,
    };

    switch (customization.backgroundType) {
      case "gradient":
        return {
          ...base,
          background: `linear-gradient(135deg, ${customization.gradientColors?.[0] || customization.colors.primary}, ${customization.gradientColors?.[1] || customization.colors.accent})`,
        };
      case "blur":
        return {
          ...base,
          backgroundColor: customization.colors.background,
          backdropFilter: `blur(${customization.blurIntensity || 10}px)`,
          backgroundImage: `radial-gradient(circle at 25% 25%, ${customization.colors.primary}20 0%, transparent 50%), radial-gradient(circle at 75% 75%, ${customization.colors.accent}20 0%, transparent 50%)`,
        };
      default:
        return {
          ...base,
          backgroundColor: customization.colors.background,
        };
    }
  };

  const viewportStyles = getViewportStyles();
  const containerStyles = getContainerStyles();

  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <div
        key={viewport}
        style={viewportStyles}
        className={cn(
          "relative overflow-hidden border-2 shadow-2xl transition-all duration-300",
          viewport === "mobile" && "rounded-[2rem] border-gray-800",
          viewport === "tablet" && "rounded-xl border-gray-600",
          viewport === "desktop" && "rounded-lg border-gray-400"
        )}
      >
        {viewport !== "desktop" && (
          <div className="absolute top-0 left-0 right-0 h-6 bg-black/10 flex items-center justify-center z-10">
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <div className="w-2 h-2 rounded-full bg-green-500" />
            </div>
          </div>
        )}
        
        <div
          style={containerStyles}
          className={cn(
            "w-full h-full overflow-auto",
            viewport !== "desktop" && "pt-6"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ResponsivePreview;
