"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Palette, 
  Type, 
  Move3D, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Moon, 
  Sun,
  RefreshCw,
  Settings2
} from "lucide-react";
import { useTheme } from "@/context/theme-provider";

const ThemeCustomizer = () => {
  const { 
    theme, 
    viewport, 
    customization, 
    toggleTheme, 
    setViewport, 
    updateCustomization, 
    resetCustomization 
  } = useTheme();
  
  const [isOpen, setIsOpen] = useState(false);

  const handleColorChange = (colorKey: keyof typeof customization.colors, value: string) => {
    updateCustomization({
      colors: {
        ...customization.colors,
        [colorKey]: value,
      },
    });
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className="w-12 h-12 rounded-full shadow-lg bg-white/80 backdrop-blur-sm border-2 hover:bg-white/90 transition-all duration-200"
          >
            <Settings2 className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-96 max-h-[80vh] overflow-y-auto" 
          side="left"
          align="start"
        >
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Theme Customizer</h3>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={toggleTheme}
                  className="flex items-center gap-2"
                >
                  {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  {theme === "light" ? "Dark" : "Light"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={resetCustomization}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>

            {/* Viewport Selector */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  Preview Mode
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    variant={viewport === "desktop" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewport("desktop")}
                    className="flex-1"
                  >
                    <Monitor className="h-4 w-4 mr-2" />
                    Desktop
                  </Button>
                  <Button
                    variant={viewport === "tablet" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewport("tablet")}
                    className="flex-1"
                  >
                    <Tablet className="h-4 w-4 mr-2" />
                    Tablet
                  </Button>
                  <Button
                    variant={viewport === "mobile" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewport("mobile")}
                    className="flex-1"
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    Mobile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Color Palette */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Color Palette
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(customization.colors).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label className="capitalize text-sm">{key}</Label>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded border" 
                        style={{ backgroundColor: value }}
                      />
                      <Input
                        type="color"
                        value={value}
                        onChange={(e) => handleColorChange(key as keyof typeof customization.colors, e.target.value)}
                        className="w-16 h-8 p-1 border rounded"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Background Style */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Background Style</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select 
                  value={customization.backgroundType} 
                  onValueChange={(value: "solid" | "gradient" | "blur") => 
                    updateCustomization({ backgroundType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid Color</SelectItem>
                    <SelectItem value="gradient">Gradient</SelectItem>
                    <SelectItem value="blur">Blurred Background</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ThemeCustomizer;
