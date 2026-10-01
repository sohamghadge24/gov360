import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.email === 'admin@gov.in' && body.password === 'admin123') {
      return NextResponse.json({
        access_token: 'demo-access-token',
        refresh_token: 'demo-refresh-token',
      });
    }
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
