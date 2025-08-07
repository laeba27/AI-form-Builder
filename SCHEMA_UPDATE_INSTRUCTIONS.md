// Add this field to your Prisma schema in the Form model
// File: prisma/schema.prisma

model Form {
  id          Int      @id @default(autoincrement())
  formId      String   @unique @default(cuid())
  userId      String
  name        String
  description String   @default("")
  jsonBlocks  String   @default("[]")
  views       Int      @default(0)
  responses   Int      @default(0)
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @default(now()) @updatedAt
  creatorName String
  settingsId  Int
  active      Boolean  @default(true) // Add this line
  
  settings FormSettings @relation(fields: [settingsId], references: [id])
  
  @@map("Form")
}

// After adding this field to your schema:
// 1. Run: npx prisma db push
// OR
// 2. Run: npx prisma migrate dev --name add_active_field

// Then restart your development server
