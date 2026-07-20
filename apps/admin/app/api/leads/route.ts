import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@consultax/db';
import { verifyToken } from '../../../lib/jwt';

export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate user
    const token = req.cookies.get('token')?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const service = searchParams.get('service') || '';
    const assigned = searchParams.get('assigned') || '';

    // 2. Build Prisma Query filters
    const where: any = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (service && service !== 'ALL') {
      where.serviceInterest = service;
    }

    if (assigned && assigned !== 'ALL') {
      where.assignedToId = assigned === 'UNASSIGNED' ? null : assigned;
    }

    // 3. Fetch leads from database
    const leads = await prisma.lead.findMany({
      where,
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        _count: {
          select: { notes: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ leads }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching leads in API:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
