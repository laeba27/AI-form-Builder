"use client";
import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/theme-provider";

interface AnimatedBlockWrapperProps {
  children: React.ReactNode;
  isSelected?: boolean;
  isHovered?: boolean;
  className?: string;
}

const AnimatedBlockWrapper: React.FC<AnimatedBlockWrapperProps> = ({
  children,
  isSelected = false,
  isHovered = false,
  className = "",
}) => {
  const { customization } = useTheme();

  const variants = {
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
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeIn" as const,
      },
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeInOut" as const,
      },
    },
    selected: {
      scale: 1.02,
      boxShadow: `0 0 0 2px ${customization.colors.primary}`,
      transition: {
        duration: 0.2,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate={isSelected ? "selected" : "animate"}
      exit="exit"
      whileHover={!isSelected ? "hover" : undefined}
      className={className}
      style={{
        borderRadius: customization.borderRadius,
        backgroundColor: customization.colors.surface,
        border: `1px solid ${customization.colors.border}`,
        color: customization.colors.text,
        fontFamily: customization.fonts.primary,
        padding: customization.spacing.md,
        margin: `${customization.spacing.sm} 0`,
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedBlockWrapper;
