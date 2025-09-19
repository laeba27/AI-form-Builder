# Form Time Limit Feature Implementation

## Overview
This document outlines the implementation of a time limit feature for forms where users can set an expiry date/time after which the form will be automatically unpublished.

## Features Implemented

### 1. Database Schema Updates
- **File**: `prisma/schema.prisma`
- **Changes**: Added `validUpto` field to `FormSettings` model
```prisma
model FormSettings {
  id  Int @id @default(autoincrement())
  primaryColor String
  backgroundColor String
  validUpto    DateTime?     // Optional expiry date/time for form
  createdAt   DateTime @default(now())
  updatedAt    DateTime      @default(now()) @updatedAt
  forms        Form[]        // List of forms using this settings object
}
```

### 2. Type Definitions
- **File**: `@types/form.type.ts`
- **Changes**: 
  - Added `validUpto` field to FormListType settings
  - Added `formContent` field to fix TypeScript errors
  - Created `FormType` alias for compatibility

### 3. Form Settings UI Component
- **File**: `app/(routes)/dashboard/_components/_common/FormSettings.tsx`
- **Features**:
  - Toggle switch to enable/disable time limit
  - Date and time picker for setting expiry
  - Real-time preview of selected date/time
  - Current expiry status display
  - Save functionality

### 4. Backend Actions
- **File**: `actions/form.action.ts`
- **New Functions**:
  - `updateFormSettings()`: Update form settings with validUpto field
  - `checkFormExpiry()`: Check if form has expired and auto-unpublish

### 5. Integration with Form Builder
- **File**: `app/(routes)/dashboard/_components/BuilderSidebar.tsx`
- **Changes**:
  - Added form settings save handler
  - Integrated with toast notifications
  - Connected FormSettings component with form data

### 6. Utility Functions
- **File**: `lib/form-expiry.ts`
- **Functions**:
  - `isFormExpired()`: Check if form is expired (client-side)
  - `getTimeUntilExpiry()`: Get formatted time remaining
  - `checkAndUnpublishExpiredForm()`: Server-side expiry check

## Database Migration Required

After setting up your database connection, run:

```bash
# Push schema changes to database
npx prisma db push

# Or create a migration
npx prisma migrate dev --name add-form-expiry

# Regenerate Prisma client
npx prisma generate
```

## Usage

### Setting Form Expiry
1. Navigate to Form Builder
2. Click on "Settings" tab in the sidebar
3. Toggle "Enable Time Limit"
4. Select expiry date and time
5. Click "Save Settings"

### Automatic Unpublishing
- Forms are automatically checked for expiry when `checkFormExpiry()` is called
- Expired forms are automatically unpublished
- You can set up a cron job or scheduled task to periodically check all forms

### Displaying Expiry Status
Use the utility functions to show expiry information:

```tsx
import { isFormExpired, getTimeUntilExpiry } from '@/lib/form-expiry';

// Check if expired
const expired = isFormExpired(form.settings.validUpto);

// Get time remaining
const timeRemaining = getTimeUntilExpiry(form.settings.validUpto);
```

## Component Props

### FormSettings Component
```tsx
interface FormSettingsProps {
  formId?: string;
  currentSettings?: {
    validUpto?: Date | null;
  };
  onSave?: (settings: { validUpto?: Date | null }) => void;
}
```

## API Endpoints

### Update Form Settings
```typescript
// Usage
const result = await updateFormSettings({
  formId: "form-uuid",
  validUpto: new Date("2024-12-31T23:59:59")
});
```

### Check Form Expiry
```typescript
// Usage
const result = await checkFormExpiry("form-uuid");
// Returns: { success, message, expired, unpublished }
```

## Future Enhancements

1. **Automatic Background Checking**: Implement a scheduled job to check all forms periodically
2. **Email Notifications**: Send notifications when forms are about to expire
3. **Grace Period**: Add a grace period before automatic unpublishing
4. **Bulk Operations**: Allow setting expiry for multiple forms at once
5. **Expiry History**: Track when forms were unpublished due to expiry

## Testing

1. Create a form
2. Set an expiry time a few minutes in the future
3. Verify the form shows as active
4. Wait for expiry time to pass
5. Call `checkFormExpiry()` to verify automatic unpublishing

## Notes

- The `validUpto` field is optional - forms without this field never expire
- Expired forms are only unpublished when `checkFormExpiry()` is called
- All times are stored in UTC in the database
- The UI uses local time zone for display and input

## Deployment Checklist

- [ ] Database schema updated with `validUpto` field
- [ ] Prisma client regenerated
- [ ] Environment variables configured
- [ ] Cron job set up for periodic expiry checking (optional)
- [ ] Test with real data to ensure proper functionality
