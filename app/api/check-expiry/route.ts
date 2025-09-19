import { NextRequest, NextResponse } from "next/server";
import { checkFormExpiry } from "@/actions/form.action";
import { checkAllFormsExpiry } from "@/lib/auto-expiry-checker";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// Check expiry for a specific form
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const formId = searchParams.get('formId');
    const checkAll = searchParams.get('checkAll');

    if (checkAll === 'true') {
      // Check all forms (admin/cron job functionality)
      const result = await checkAllFormsExpiry();
      return NextResponse.json(result);
    }

    if (!formId) {
      return NextResponse.json({
        success: false,
        message: "formId parameter is required"
      }, { status: 400 });
    }

    const result = await checkFormExpiry(formId);
    return NextResponse.json(result);

  } catch (error) {
    console.error("Error in check-expiry API:", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error"
    }, { status: 500 });
  }
}

// Manual trigger for checking expiry (POST method)
export async function POST(request: NextRequest) {
  try {
    const session = getKindeServerSession();
    const user = await session.getUser();

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized"
      }, { status: 401 });
    }

    const body = await request.json();
    const { formId, checkAll } = body;

    if (checkAll) {
      // Check all forms
      const result = await checkAllFormsExpiry();
      return NextResponse.json(result);
    }

    if (!formId) {
      return NextResponse.json({
        success: false,
        message: "formId is required"
      }, { status: 400 });
    }

    const result = await checkFormExpiry(formId);
    return NextResponse.json(result);

  } catch (error) {
    console.error("Error in check-expiry API:", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error"
    }, { status: 500 });
  }
}
