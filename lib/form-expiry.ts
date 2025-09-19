import { checkFormExpiry } from "@/actions/form.action";

/**
 * Utility function to check if a form has expired based on its validUpto setting
 */
export async function checkAndUnpublishExpiredForm(formId: string) {
  try {
    const result = await checkFormExpiry(formId);
    return result;
  } catch (error) {
    console.error("Error checking form expiry:", error);
    return {
      success: false,
      message: "Error checking form expiry",
    };
  }
}

/**
 * Client-side function to check if a form is expired
 */
export function isFormExpired(validUpto: Date | null | undefined): boolean {
  if (!validUpto) return false;
  return new Date() > new Date(validUpto);
}

/**
 * Get time remaining until form expires
 */
export function getTimeUntilExpiry(validUpto: Date | null | undefined): string {
  if (!validUpto) return "No expiry set";
  
  const now = new Date();
  const expiry = new Date(validUpto);
  const diff = expiry.getTime() - now.getTime();
  
  if (diff <= 0) return "Expired";
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} remaining`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} remaining`;
  
  return "Less than a minute remaining";
}
