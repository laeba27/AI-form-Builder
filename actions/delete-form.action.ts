"use server";

import { prisma } from "@/lib/prismadb";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function softDeleteForm(formId: string) {
  try {
    const session = getKindeServerSession();
    const user = await session.getUser();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized to use this resource",
      };
    }

    // First, verify that the form belongs to the current user
    const existingForm = await prisma.form.findFirst({
      where: {
        formId: formId,
        userId: user.id,
        // active: true, // Uncomment when active field is added to schema
      },
    });

    if (!existingForm) {
      return {
        success: false,
        message: "Form not found or you don't have permission to delete it",
      };
    }

    // For now, we'll do a hard delete until the active field is added to the schema
    // Once the active field is added, change this to: 
    // await prisma.form.update({
    //   where: { id: existingForm.id },
    //   data: { active: false, updatedAt: new Date() }
    // });
    
    await prisma.form.delete({
      where: {
        id: existingForm.id,
      },
    });

    return {
      success: true,
      message: "Form deleted successfully",
      formId: formId,
    };

  } catch (error) {
    console.error("Error deleting form:", error);
    return {
      success: false,
      message: "Something went wrong while deleting the form",
    };
  }
}
