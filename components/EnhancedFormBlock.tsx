"use client";
import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/theme-provider";
import { FormBlockInstance } from "@/@types/form-block.type";

interface EnhancedFormBlockProps {
  block: FormBlockInstance;
  children: React.ReactNode;
  isSelected?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
  className?: string;
}

const EnhancedFormBlock: React.FC<EnhancedFormBlockProps> = ({
  block,
  children,
  isSelected = false,
  onSelect,
  onDelete,
  className = "",
}) => {
  const { customization } = useTheme();

  const blockVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.9,
      transition: {
        duration: 0.2,
        ease: "easeIn" as const,
      },
    },
    hover: {
      scale: 1.02,
      boxShadow: `0 4px 20px ${customization.colors.primary}20`,
      transition: {
        duration: 0.2,
        ease: "easeInOut" as const,
      },
    },
    selected: {
      scale: 1.02,
      boxShadow: `0 0 0 2px ${customization.colors.primary}, 0 4px 20px ${customization.colors.primary}20`,
      borderColor: customization.colors.primary,
      transition: {
        duration: 0.2,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <motion.div
      layout
      variants={blockVariants}
      initial="initial"
      animate={isSelected ? "selected" : "animate"}
      exit="exit"
      whileHover={!isSelected ? "hover" : undefined}
      onClick={onSelect}
      className={`relative group cursor-pointer ${className}`}
      style={{
        borderRadius: customization.borderRadius,
        backgroundColor: customization.colors.surface,
        border: `2px solid ${isSelected ? customization.colors.primary : customization.colors.border}`,
        color: customization.colors.text,
        fontFamily: customization.fonts.primary,
        padding: customization.spacing.md,
        margin: `${customization.spacing.sm} 0`,
      }}
    >
      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 -right-2 z-10"
        >
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: customization.colors.primary }}
          >
            ✓
          </div>
        </motion.div>
      )}

      {/* Delete button */}
      {isSelected && onDelete && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute -top-2 -left-2 z-10 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-red-600 transition-colors"
        >
          ×
        </motion.button>
      )}

      {/* Hover overlay */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${customization.colors.primary}10, ${customization.colors.accent}10)`,
          borderRadius: customization.borderRadius,
        }}
      />

      {/* Content */}
      <div className="relative z-[1]">
        {children}
      </div>

      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 rounded-inherit overflow-hidden pointer-events-none"
        initial={false}
        whileTap={{
          background: [
            "transparent",
            `radial-gradient(circle, ${customization.colors.primary}20 0%, transparent 70%)`,
            "transparent"
          ],
        }}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  );
};

export default EnhancedFormBlock;
