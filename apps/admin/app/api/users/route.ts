import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@consultax/db';
import { verifyToken } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate user
    const token = req.cookies.get('token')?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch users for selection dropdowns
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching users in API:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
