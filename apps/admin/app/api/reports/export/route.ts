import { NextRequest } from 'next/server';
import { prisma } from '@consultax/db';
import { verifyToken } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate user
    const token = req.cookies.get('token')?.value;
    if (!token || !(await verifyToken(token))) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const status = searchParams.get('status');
    const service = searchParams.get('service');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // 2. Build DB query filters
    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (service && service !== 'ALL') {
      where.serviceInterest = service;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // include full day
        where.createdAt.lte = end;
      }
    }

    const leads = await prisma.lead.findMany({
      where,
      include: {
        assignedTo: {
          select: { name: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 3. Compile CSV text stream
    const headers = [
      'Lead ID',
      'Client Name',
      'Phone Number',
      'Email Address',
      'Service of Interest',
      'Source Page Reference',
      'Lead Status',
      'Assigned Consultant',
      'Submission Date',
    ];

    let csvContent = headers.join(',') + '\r\n';

    for (const lead of leads) {
      const escape = (val: string | null) => {
        if (!val) return '""';
        return `"${val.replace(/"/g, '""')}"`;
      };

      const row = [
        lead.id,
        escape(lead.fullName),
        escape(lead.phone),
        escape(lead.email),
        escape(lead.serviceInterest || 'General Inquiry'),
        escape(lead.sourcePage),
        lead.status,
        lead.assignedTo ? escape(lead.assignedTo.name) : '"Unassigned"',
        new Date(lead.createdAt).toISOString(),
      ];

      csvContent += row.join(',') + '\r\n';
    }

    // 4. Return attachment headers
    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="consultax_leads_report.csv"',
      },
    });
  } catch (error: any) {
    console.error('Error exporting CSV report:', error);
    return new Response('An error occurred during export.', { status: 500 });
  }
}
