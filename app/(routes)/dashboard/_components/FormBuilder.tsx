"use client";
import React, { useState } from "react";
import { Loader } from "lucide-react";
import { DndContext, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useBuilder } from "@/context/builder-provider";
import Builder from "./Builder";
import BuilderDragOverlay from "./BuilderDragOverlay";
import SimpleThemeCustomizer from "@/components/SimpleThemeCustomizer";
import SimpleResponsiveWrapper from "@/components/SimpleResponsiveWrapper";

const FormBuilder = () => {
  const { loading, formData } = useBuilder();
  const isPublished = formData?.published;

  if (loading) {
    return (
      <div
        className="w-full 
    flex h-56
     items-center
      justify-center"
      >
        <Loader size="3rem" className="animate-spin" />
      </div>
    );
  }

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 8,
    },
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(
    isPublished ? false : true
  );
  
  const [themeConfig, setThemeConfig] = useState({
    viewport: "desktop" as "desktop" | "tablet" | "mobile",
    colors: {
      primary: "#7c3aed",
      secondary: "#a855f7", 
      accent: "#ec4899",
      background: "#ffffff",
    },
    isDark: false,
  });

  const handleThemeChange = (newTheme: any) => {
    setThemeConfig(prev => ({ ...prev, ...newTheme }));
  };
  
  return (
    <div className="relative">
      <DndContext sensors={useSensors(mouseSensor)}>
        <BuilderDragOverlay />

        <SimpleResponsiveWrapper 
          viewport={themeConfig.viewport}
          className="min-h-[calc(100vh-64px)]"
        >
          <SidebarProvider
            open={isSidebarOpen}
            onOpenChange={setIsSidebarOpen}
            className="h-full"
            style={
              {
                "--sidebar-width": "300px",
                "--sidbar-height": "40px",
              } as React.CSSProperties
            }
          >
            <Builder {...{ isSidebarOpen }} />
          </SidebarProvider>
        </SimpleResponsiveWrapper>
      </DndContext>
      
      <SimpleThemeCustomizer onThemeChange={handleThemeChange} />
    </div>
  );
};

export default FormBuilder;
