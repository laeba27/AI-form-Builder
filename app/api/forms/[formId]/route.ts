import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prismadb';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { formId: string } }
) {
  try {
    const session = getKindeServerSession();
    const user = await session.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { formId } = params;

    // First, verify that the form belongs to the current user
    const existingForm = await prisma.form.findFirst({
      where: {
        formId: formId,
        userId: user.id,
        // active: true, // Uncomment when active field is added to schema
      },
    });

    if (!existingForm) {
      return NextResponse.json(
        { success: false, message: 'Form not found or already deleted' },
        { status: 404 }
      );
    }

    // Soft delete: Set active to false instead of deleting the record
    const updatedForm = await prisma.form.update({
      where: {
        id: existingForm.id,
      },
      data: {
        // active: false, // Uncomment when active field is added to schema
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Form deleted successfully',
      formId: updatedForm.formId,
    });

  } catch (error) {
    console.error('Error deleting form:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
