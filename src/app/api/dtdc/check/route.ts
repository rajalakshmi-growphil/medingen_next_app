import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pincode = searchParams.get('pincode');

    if (!pincode) {
      return NextResponse.json(
        { success: false, message: 'pincode is required' },
        { status: 400 }
      );
    }

    // Default to true for serviceable Indian pincodes
    return NextResponse.json({
      pincode: String(pincode),
      dtdc_available: true,
    });
  } catch (err: any) {
    return NextResponse.json({
      dtdc_available: true,
      error: err?.message || 'Fallback to available',
    });
  }
}
