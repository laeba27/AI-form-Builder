"use client";
import BlockBtnElement from "@/components/BlockBtnElement";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useBuilder } from "@/context/builder-provider";
import { useTheme } from "@/context/theme-provider";
import { FormBlocks } from "@/lib/form-blocks";
import { Palette, Settings, Plus, Type, ChevronDown, Search, PaintBucket, Layout, Sun, Moon } from "lucide-react";
import React, { useState } from "react";
import AIAssistanceBtn from "./AIAssistanceBtn";
import ThemePreview from "@/components/ThemePreview";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const FormBlockBox = () => {
  const { formData } = useBuilder();
  const { theme, customization, updateCustomization } = useTheme();
  const isPublished = formData?.published;

  const [search, setSearch] = useState<string>("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState("#8b5cf6");

  const filteredBlocks = Object.values(FormBlocks).filter((block) =>
    block.blockBtnElement.label?.toLowerCase().includes(search.toLowerCase())
  );

  const layoutBlocks = filteredBlocks.filter(
    (block) => block.blockCategory === "Layout"
  );

  const fieldBlocks = filteredBlocks.filter(
    (block) => block.blockCategory === "Field"
  );

  // Separate basic fields from advanced fields
  const basicFields = fieldBlocks.filter((block) =>
    ["TextField", "TextArea", "Paragraph", "Heading"].includes(block.blockType)
  );

  const advancedFields = fieldBlocks.filter((block) =>
    ["RadioSelect", "StarRating", "DatePicker", "Dropdown"].includes(block.blockType)
  );

  const colorPresets = [
    {
      name: "Purple",
      value: "purple",
      primary: "#8b5cf6",
      secondary: "#a78bfa",
      accent: "#ec4899",
      background: "#faf5ff",
      surface: "#f8fafc",
      text: "#1e293b",
      border: "#e2e8f0"
    },
    {
      name: "Blue",
      value: "blue",
      primary: "#3b82f6",
      secondary: "#60a5fa",
      accent: "#1d4ed8",
      background: "#eff6ff",
      surface: "#f1f5f9",
      text: "#1e293b",
      border: "#e2e8f0"
    },
    {
      name: "Green",
      value: "green",
      primary: "#10b981",
      secondary: "#34d399",
      accent: "#059669",
      background: "#ecfdf5",
      surface: "#f0fdf4",
      text: "#1e293b",
      border: "#e2e8f0"
    },
    {
      name: "Orange",
      value: "orange",
      primary: "#f59e0b",
      secondary: "#fbbf24",
      accent: "#d97706",
      background: "#fffbeb",
      surface: "#fefce8",
      text: "#1e293b",
      border: "#e2e8f0"
    },
    {
      name: "Pink",
      value: "pink",
      primary: "#ec4899",
      secondary: "#f472b6",
      accent: "#db2777",
      background: "#fdf2f8",
      surface: "#fef7ff",
      text: "#1e293b",
      border: "#e2e8f0"
    },
    {
      name: "Red",
      value: "red",
      primary: "#ef4444",
      secondary: "#f87171",
      accent: "#dc2626",
      background: "#fef2f2",
      surface: "#fefefe",
      text: "#1e293b",
      border: "#e2e8f0"
    },
    {
      name: "Indigo",
      value: "indigo",
      primary: "#6366f1",
      secondary: "#818cf8",
      accent: "#4f46e5",
      background: "#eef2ff",
      surface: "#f1f5f9",
      text: "#1e293b",
      border: "#e2e8f0"
    },
    {
      name: "Teal",
      value: "teal",
      primary: "#14b8a6",
      secondary: "#5eead4",
      accent: "#0d9488",
      background: "#f0fdfa",
      surface: "#f0fdf4",
      text: "#1e293b",
      border: "#e2e8f0"
    },
  ];

  const backgroundTypes = [
    { name: "Solid", value: "solid", icon: "⬜", description: "Clean solid background" },
    { name: "Gradient", value: "gradient", icon: "🌈", description: "Beautiful gradient effect" },
    { name: "Blur", value: "blur", icon: "🖼️", description: "Subtle blurred background" },
  ];

  const fontOptions = [
    { name: "Inter", value: "font-sans", description: "Modern sans-serif" },
    { name: "Serif", value: "font-serif", description: "Classic serif font" },
    { name: "Mono", value: "font-mono", description: "Monospace font" },
    { name: "Poppins", value: "font-poppins", description: "Friendly rounded font" },
  ];

  const handleColorPresetChange = (colorValue: string) => {
    const selectedColor = colorPresets.find(color => color.value === colorValue);
    if (selectedColor) {
      updateCustomization({
        colors: {
          primary: selectedColor.primary,
          secondary: selectedColor.secondary,
          accent: selectedColor.accent,
          background: selectedColor.background,
          surface: selectedColor.surface,
          text: selectedColor.text,
          border: selectedColor.border
        }
      });
      setShowColorPicker(false);
    }
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    // Generate complementary colors based on the custom color
    updateCustomization({
      colors: {
        primary: color,
        secondary: color + "80", // Adding opacity for lighter variant
        accent: color,
        background: "#ffffff",
        surface: "#f8fafc",
        text: "#1e293b",
        border: "#e2e8f0"
      }
    });
  };

  return (
    <div className="flex h-full w-full flex-col gap-4 p-4 bg-gray-50/50">
      {/* Header Section */}
      <Card className="p-4 shadow-sm border-gray-200">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center justify-center mb-2">
            <div className="flex items-center justify-center gap-2  bg-purple-50 px-4 py-2 rounded-lg shadow-sm">
              <PaintBucket className="h-5 w-5 text-purple-600" />
              <h2 className="font-semibold text-lg text-gray-800 tracking-tight">Form Builder</h2>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {/* <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          
          <input
            type="text"
            placeholder="Search blocks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          />
        </div> */}

        {/* AI Assistant Button */}
        <div className="flex w-full justify-center">
          <AIAssistanceBtn />
        </div>
      </Card>

      {/* Theme Customization Section */}
      <Card className="p-4 shadow-sm border-gray-200">
        <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Typography
        </h3>

        {/* Color Selection */}

        <div className="space-y-3">
          {/* <Label className="text-sm font-medium text-gray-700">Color Scheme</Label>
          <Select onValueChange={handleColorPresetChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a color scheme" />
            </SelectTrigger>
            <SelectContent>
              {colorPresets.map((color) => (
                <SelectItem key={color.value} value={color.value}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border border-gray-200"
                      style={{ backgroundColor: color.primary }}
                    />
                    <span>{color.name}</span>
                  </div>
                </SelectItem>
              ))}
              <SelectItem
                value="custom"
                onSelect={() => setShowColorPicker(true)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-gray-200 bg-gradient-to-r from-purple-500 to-pink-500" />
                  <span>Custom Color</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select> */}

          {/* Custom Color Picker */}
          {/* {showColorPicker && (
            <div className="mt-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Custom Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  placeholder="#8b5cf6"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          )} */}
        </div>

        {/* Background Type */}
        {/* <div className="mt-4 space-y-3">
          <Label className="text-sm font-medium text-gray-700">Background Style</Label>
          <div className="grid grid-cols-3 gap-2">
            {backgroundTypes.map((bg) => (
              <button
                key={bg.value}
                onClick={() => updateCustomization({ backgroundType: bg.value as "solid" | "gradient" | "blur" })}
                className={`p-3 rounded-lg border transition-all text-center hover:shadow-sm ${customization.backgroundType === bg.value
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
              >
                <div className="text-lg mb-1">{bg.icon}</div>
                <div className="text-xs font-medium">{bg.name}</div>
                <div className="text-xs text-gray-500 mt-1">{bg.description}</div>
              </button>
            ))}
          </div>
        </div> */}

        {/* Font Selection */}
        <div className="mt-4 space-y-3">
          {/* <Label className="text-sm font-medium text-gray-700">Typography</Label> */}
          <Select
            value={customization.fonts.primary}
            onValueChange={(value) =>
              updateCustomization({
                fonts: { ...customization.fonts, primary: value },
              })
            }
          >
            <SelectTrigger className="w-full rounded-md border border-purple-500 py-3 px-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <SelectValue placeholder="Select a font" />
            </SelectTrigger>

            <SelectContent>
              {fontOptions.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  <div className="flex flex-col justify-start items-start ">
                    <span className={`${font.value} font-semibold text-sm`}>
                      {font.name}
                    </span>
                    {/* <span className="text-xs text-gray-500">{font.description}</span> */}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Theme Toggle */}
        {/* <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <span className="text-sm font-medium text-gray-700">
              {theme === "dark" ? "Dark Mode" : "Light Mode"}
            </span>
          </div>
          <button
            onClick={() => {
              // Toggle theme logic will be handled by theme context
              console.log('Theme toggle clicked');
            }}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 data-[checked]:bg-purple-600"
            role="switch"
            aria-checked={theme === "dark"}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === "dark" ? "translate-x-6" : "translate-x-1"
              }`} />
          </button>
        </div> */}
      </Card>

      {/* Layout Blocks Section */}
      {layoutBlocks?.length > 0 && (
        <Card className="p-4 shadow-sm border-gray-200">
          <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Layout Blocks
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {layoutBlocks?.map((block) => (
              <BlockBtnElement
                key={block.blockType}
                formBlock={block}
                disabled={isPublished}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Basic Fields Section */}
      <Card className="p-4 shadow-sm border-gray-200">
        <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Basic Fields
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {basicFields?.map((block) => (
            <BlockBtnElement
              key={block.blockType}
              formBlock={block}
              disabled={isPublished}
            />
          ))}
        </div>
      </Card>

      {/* Advanced Fields Section */}
      <Card className="p-4 shadow-sm border-gray-200">
        <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Advanced Fields
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {advancedFields?.map((block) => (
            <BlockBtnElement
              key={block.blockType}
              formBlock={block}
              disabled={isPublished}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default FormBlockBox;
