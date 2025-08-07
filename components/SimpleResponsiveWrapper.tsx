"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SimpleResponsiveWrapperProps {
  children: React.ReactNode;
  viewport?: "desktop" | "tablet" | "mobile";
  className?: string;
}

const SimpleResponsiveWrapper: React.FC<SimpleResponsiveWrapperProps> = ({ 
  children, 
  viewport = "desktop",
  className 
}) => {
  const [currentViewport, setCurrentViewport] = useState(viewport);

  useEffect(() => {
    setCurrentViewport(viewport);
  }, [viewport]);

  const getViewportStyles = () => {
    switch (currentViewport) {
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
      default:
        return {
          width: "100%",
          height: "100%",
        };
    }
  };

  const viewportStyles = getViewportStyles();

  if (currentViewport === "desktop") {
    return (
      <div className={className} style={viewportStyles}>
        {children}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <div
        style={viewportStyles}
        className={cn(
          "relative overflow-hidden border-2 shadow-xl transition-all duration-300 bg-white",
          currentViewport === "mobile" && "rounded-[2rem] border-gray-800",
          currentViewport === "tablet" && "rounded-xl border-gray-600"
        )}
      >
        {/* Device Header */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-gray-100 flex items-center justify-center z-10 border-b">
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>
        </div>
        
        {/* Content */}
        <div className="w-full h-full overflow-auto pt-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SimpleResponsiveWrapper;
