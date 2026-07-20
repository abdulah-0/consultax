import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@consultax/db';
import { verifyToken } from '../../../../lib/jwt';

export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate user
    const token = req.cookies.get('token')?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Start of current week (Sunday)

    // 2. Query stats from DB
    const totalLeads = await prisma.lead.count();
    
    const newLeadsToday = await prisma.lead.count({
      where: {
        createdAt: { gte: startOfDay },
      },
    });

    const newLeadsThisWeek = await prisma.lead.count({
      where: {
        createdAt: { gte: startOfWeek },
      },
    });

    const openLeadsCount = await prisma.lead.count({
      where: {
        status: { in: ['NEW', 'CONTACTED', 'IN_PROGRESS'] },
      },
    });

    const convertedLeadsCount = await prisma.lead.count({
      where: {
        status: 'CONVERTED',
      },
    });

    const newLeadsCount = await prisma.lead.count({
      where: {
        status: 'NEW',
      },
    });

    // Group leads by service interest
    const leadsByServiceRaw = await prisma.lead.groupBy({
      by: ['serviceInterest'],
      _count: {
        id: true,
      },
    });

    const leadsByService = leadsByServiceRaw.map((group) => ({
      service: group.serviceInterest || 'General Inquiry',
      count: group._count.id,
    }));

    // Generate last 7 days trend
    const trend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);

      const count = await prisma.lead.count({
        where: {
          createdAt: {
            gte: dayStart,
            lt: dayEnd,
          },
        },
      });

      trend.push({ date: dateStr, count });
    }

    return NextResponse.json(
      {
        totalLeads,
        newLeadsToday,
        newLeadsThisWeek,
        openLeadsCount,
        convertedLeadsCount,
        newLeadsCount,
        leadsByService,
        trend,
        avgResponseTime: '1.8 hours', // static mockup for v1
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in leads stats API:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
