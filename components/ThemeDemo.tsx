"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/context/theme-provider";

const ThemeDemo = () => {
  const { customization } = useTheme();

  const demoBlocks = [
    {
      id: "1",
      type: "heading",
      title: "Welcome to Your Form",
      content: "This is a sample heading block with custom styling"
    },
    {
      id: "2", 
      type: "text",
      title: "Full Name",
      content: "Enter your full name here"
    },
    {
      id: "3",
      type: "email", 
      title: "Email Address",
      content: "Enter your email address"
    },
    {
      id: "4",
      type: "textarea",
      title: "Tell us about yourself",
      content: "Share your thoughts and experiences"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 max-w-2xl mx-auto space-y-6"
      style={{
        fontFamily: customization.fonts.primary,
        color: customization.colors.text,
      }}
    >
      {demoBlocks.map((block, index) => (
        <motion.div
          key={block.id}
          variants={itemVariants}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2, ease: "easeInOut" as const }
          }}
          className="group"
        >
          <Card
            style={{
              backgroundColor: customization.colors.surface,
              borderColor: customization.colors.border,
              borderRadius: customization.borderRadius,
              borderWidth: '1px',
            }}
            className="hover:shadow-lg transition-all duration-300"
          >
            <CardHeader style={{ padding: customization.spacing.md }}>
              <CardTitle 
                style={{ 
                  color: customization.colors.text,
                  fontFamily: customization.fonts.primary,
                  fontSize: block.type === "heading" ? "1.5rem" : "1rem"
                }}
              >
                {block.title}
              </CardTitle>
            </CardHeader>
            <CardContent style={{ padding: `0 ${customization.spacing.md} ${customization.spacing.md}` }}>
              {block.type === "heading" && (
                <p style={{ color: customization.colors.text, opacity: 0.8 }}>
                  {block.content}
                </p>
              )}
              {block.type === "text" && (
                <Input
                  placeholder={block.content}
                  style={{
                    backgroundColor: customization.colors.background,
                    borderColor: customization.colors.border,
                    color: customization.colors.text,
                    borderRadius: customization.borderRadius,
                  }}
                  className="transition-all duration-200 focus:ring-2"
                />
              )}
              {block.type === "email" && (
                <Input
                  type="email"
                  placeholder={block.content}
                  style={{
                    backgroundColor: customization.colors.background,
                    borderColor: customization.colors.border,
                    color: customization.colors.text,
                    borderRadius: customization.borderRadius,
                  }}
                  className="transition-all duration-200 focus:ring-2"
                />
              )}
              {block.type === "textarea" && (
                <Textarea
                  placeholder={block.content}
                  rows={3}
                  style={{
                    backgroundColor: customization.colors.background,
                    borderColor: customization.colors.border,
                    color: customization.colors.text,
                    borderRadius: customization.borderRadius,
                  }}
                  className="transition-all duration-200 focus:ring-2 resize-none"
                />
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Submit Button */}
      <motion.div
        variants={itemVariants}
        className="pt-4"
      >
        <Button
          className="w-full transition-all duration-300 hover:scale-105"
          style={{
            backgroundColor: customization.colors.primary,
            color: "white",
            borderRadius: customization.borderRadius,
            padding: `${customization.spacing.md} ${customization.spacing.lg}`,
            fontFamily: customization.fonts.primary,
            fontSize: "1rem",
            fontWeight: "600",
          }}
        >
          Submit Form
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ThemeDemo;
