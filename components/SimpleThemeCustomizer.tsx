"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Palette, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Moon, 
  Sun,
  Settings2
} from "lucide-react";

interface SimpleThemeCustomizerProps {
  onThemeChange?: (theme: any) => void;
}

const SimpleThemeCustomizer: React.FC<SimpleThemeCustomizerProps> = ({ onThemeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [colors, setColors] = useState({
    primary: "#7c3aed",
    secondary: "#a855f7",
    accent: "#ec4899",
    background: "#ffffff",
  });

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark", !isDark);
  };

  const handleColorChange = (colorKey: string, value: string) => {
    const newColors = { ...colors, [colorKey]: value };
    setColors(newColors);
    
    // Apply color to CSS variables
    document.documentElement.style.setProperty(`--theme-${colorKey}`, value);
    
    if (onThemeChange) {
      onThemeChange({ colors: newColors, viewport, isDark });
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className="w-12 h-12 rounded-full shadow-lg bg-white/90 backdrop-blur-sm border-2 hover:bg-white transition-all duration-200"
          >
            <Settings2 className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-80 max-h-[70vh] overflow-y-auto" 
          side="left"
          align="start"
        >
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Theme Settings</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleTheme}
                className="flex items-center gap-2"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {isDark ? "Light" : "Dark"}
              </Button>
            </div>

            {/* Viewport Selector */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  Device Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-1">
                  <Button
                    variant={viewport === "desktop" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewport("desktop")}
                    className="flex-1 text-xs"
                  >
                    <Monitor className="h-3 w-3 mr-1" />
                    Desktop
                  </Button>
                  <Button
                    variant={viewport === "tablet" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewport("tablet")}
                    className="flex-1 text-xs"
                  >
                    <Tablet className="h-3 w-3 mr-1" />
                    Tablet
                  </Button>
                  <Button
                    variant={viewport === "mobile" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewport("mobile")}
                    className="flex-1 text-xs"
                  >
                    <Smartphone className="h-3 w-3 mr-1" />
                    Mobile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Colors */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Colors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(colors).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label className="capitalize text-sm">{key}</Label>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded border-2 border-gray-200" 
                        style={{ backgroundColor: value }}
                      />
                      <Input
                        type="color"
                        value={value}
                        onChange={(e) => handleColorChange(key, e.target.value)}
                        className="w-12 h-8 p-0 border-0 rounded cursor-pointer"
                        style={{ backgroundColor: value }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Preview Info */}
            <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded">
              Current: {viewport} • {isDark ? "Dark" : "Light"} mode
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SimpleThemeCustomizer;
