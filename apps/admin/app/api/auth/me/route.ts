import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    let token = req.cookies.get('token')?.value;

    // Fallback: Check for Authorization header (useful for mobile clients)
    if (!token) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated.' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Session expired or invalid token.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        user: {
          id: payload.id,
          name: payload.name,
          email: payload.email,
          role: payload.role,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in /api/auth/me route:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
