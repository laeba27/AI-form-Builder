"use server";
import { checkFormExpiry } from "@/actions/form.action";
import { prisma } from "@/lib/prismadb";

/**
 * Check all published forms for expiry and unpublish expired ones
 * This function can be called by a cron job or scheduled task
 */
export async function checkAllFormsExpiry() {
  try {
    console.log("Starting form expiry check...");
    
    // Get all published forms that have expiry settings
    const formsWithExpiry = await prisma.$queryRaw<[{formId: string, validUpto: Date}]>`
      SELECT f."formId", fs."validUpto"
      FROM "Form" f
      INNER JOIN "FormSettings" fs ON f."formId"::text = fs."formId"::text
      WHERE f.published = true 
      AND fs."validUpto" IS NOT NULL
      AND fs."validUpto" < NOW()
    `;

    const results = [];
    
    for (const form of formsWithExpiry) {
      const result = await checkFormExpiry(form.formId);
      results.push({
        formId: form.formId,
        result: result
      });
    }

    console.log(`Form expiry check completed. Checked ${results.length} forms.`);
    
    return {
      success: true,
      message: `Checked ${results.length} forms for expiry`,
      results: results
    };
    
  } catch (error) {
    console.error("Error checking forms expiry:", error);
    return {
      success: false,
      message: "Error checking forms expiry",
      error: error
    };
  }
}

/**
 * Check expiry for forms owned by a specific user
 */
export async function checkUserFormsExpiry(userId: string) {
  try {
    // Get all published forms for this user that have expiry settings
    const formsWithExpiry = await prisma.$queryRaw<[{formId: string, validUpto: Date}]>`
      SELECT f."formId", fs."validUpto"
      FROM "Form" f
      INNER JOIN "FormSettings" fs ON f."formId"::text = fs."formId"::text
      WHERE f.published = true 
      AND f."userId" = ${userId}
      AND fs."validUpto" IS NOT NULL
      AND fs."validUpto" < NOW()
    `;

    const results = [];
    
    for (const form of formsWithExpiry) {
      const result = await checkFormExpiry(form.formId);
      results.push({
        formId: form.formId,
        result: result
      });
    }

    return {
      success: true,
      message: `Checked ${results.length} forms for user ${userId}`,
      results: results
    };
    
  } catch (error) {
    console.error("Error checking user forms expiry:", error);
    return {
      success: false,
      message: "Error checking user forms expiry",
      error: error
    };
  }
}
