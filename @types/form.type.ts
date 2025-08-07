import { Form, FormSettings } from "@prisma/client";

export type FormWithSettings = Form & { settings: FormSettings };

// Type for forms returned from fetchAllForms action
export type FormListType = {
  id: number;
  formId: string;
  name: string;
  published: boolean;
  createdAt: Date;
  responses: number;
  views: number;
  settings: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    primaryColor: string;
    backgroundColor: string;
  };
  userId: string;
  settingsId: number;
  jsonBlocks: string;
  updatedAt: Date;
  description: string;
  creatorName: string;
  active?: boolean; // Optional until database schema is updated
};
