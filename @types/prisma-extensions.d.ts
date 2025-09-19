// Temporary type extensions for FormSettings validUpto field
// This should be removed once Prisma client is regenerated with validUpto field

declare module "@prisma/client" {
  interface FormSettings {
    validUpto?: Date | null;
  }
}

export {}; // Make this a module
