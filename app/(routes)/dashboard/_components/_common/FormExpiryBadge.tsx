"use client";
import React from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { isFormExpired, getTimeUntilExpiry } from "@/lib/form-expiry";
import { cn } from "@/lib/utils";

interface FormExpiryBadgeProps {
  validUpto?: Date | null;
  published?: boolean;
}

const FormExpiryBadge = ({ validUpto, published }: FormExpiryBadgeProps) => {
  if (!validUpto) return null;

  const expired = isFormExpired(validUpto);
  const timeRemaining = getTimeUntilExpiry(validUpto);

  if (expired) {
    return (
      <div className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
        "bg-red-100 text-red-800 border border-red-200"
      )}>
        <AlertTriangle className="h-3 w-3" />
        Expired
      </div>
    );
  }

  if (published) {
    return (
      <div className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
        "bg-blue-100 text-blue-800 border border-blue-200"
      )}>
        <Clock className="h-3 w-3" />
        {timeRemaining}
      </div>
    );
  }

  return null;
};

export default FormExpiryBadge;
