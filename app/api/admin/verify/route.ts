import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({
        success: false,
        error: 'Admin password not configured'
      }, { status: 500 });
    }

    if (password !== adminPassword) {
      return NextResponse.json({
        success: false,
        error: 'Invalid password'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: 'Password verified'
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Verification failed'
    }, { status: 500 });
  }
}
