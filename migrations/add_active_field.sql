-- Migration script to add the 'active' field to the Form table
-- Run this in your database or add it to your Prisma schema
-- Add the active column to the existing Form table
ALTER TABLE "Form"
ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT true;

-- Update existing records to set active = true (since they should all be active by default)
UPDATE "Form"
SET
    "active" = true
WHERE
    "active" IS NULL;

-- Optional: Create an index on the active column for better query performance
CREATE INDEX "Form_active_idx" ON "Form" ("active");

-- Optional: Create a composite index for common queries (userId + active)
CREATE INDEX "Form_userId_active_idx" ON "Form" ("userId", "active");