"use client";
import { useTheme } from "@/context/theme-provider";
import { cn } from "@/lib/utils";

export default function ThemePreview() {
  const { customization } = useTheme();

  return (
    <div className="w-full p-3 border rounded-lg bg-gray-50">
      <div className="text-xs font-medium text-gray-600 mb-2">Preview</div>
      <div 
        className={cn(
          "w-full h-20 rounded border shadow-sm relative overflow-hidden",
          customization.backgroundType === "solid" && "bg-white",
        )}
        style={{
          backgroundColor: customization.backgroundType === "solid" 
            ? customization.colors.background 
            : undefined,
          backgroundImage: customization.backgroundType === "gradient"
            ? `linear-gradient(to bottom right, ${customization.colors.primary}20, ${customization.colors.secondary}20)`
            : customization.backgroundType === "blur"
            ? "url(/images/form-bg.jpg)"
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          fontFamily: customization.fonts.primary === "font-sans" ? "Inter, sans-serif" :
                     customization.fonts.primary === "font-serif" ? "serif" :
                     customization.fonts.primary === "font-mono" ? "monospace" :
                     customization.fonts.primary === "font-poppins" ? "Poppins, sans-serif" : 
                     "Inter, sans-serif"
        }}
      >
        {customization.backgroundType === "blur" && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
        )}
        <div className="relative p-3 h-full flex flex-col justify-center">
          <div 
            className="text-sm font-medium mb-1"
            style={{ 
              color: customization.colors.primary,
              fontFamily: "inherit"
            }}
          >
            Form Title
          </div>
          <div className="w-full h-2 bg-gray-200 rounded mb-1" />
          <div className="w-3/4 h-2 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
