"use client";

import { motion } from "motion/react";
import React from "react";

interface AdminPageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminPageTransition({ children, className = "" }: AdminPageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{
        duration: 0.28,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
