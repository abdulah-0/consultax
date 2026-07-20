import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@consultax/db';
import { verifyToken } from '@/lib/jwt';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // 1. Authenticate user
    const token = req.cookies.get('token')?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch single lead details
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        notes: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
    }

    return NextResponse.json({ lead }, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET lead detail API:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // 1. Authenticate user
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse request body
    const body = await req.json();
    const { status, assignedToId } = body;

    // Fetch existing lead state
    const currentLead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!currentLead) {
      return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
    }

    const updateData: any = {};
    const auditLogs: string[] = [];

    // Check status changes
    if (status && status !== currentLead.status) {
      updateData.status = status;
      auditLogs.push(`Status updated from ${currentLead.status} to ${status}`);
    }

    // Check assignment changes
    if (assignedToId !== undefined && assignedToId !== currentLead.assignedToId) {
      updateData.assignedToId = assignedToId === '' ? null : assignedToId;
      
      let assigneeName = 'Unassigned';
      if (assignedToId) {
        const staff = await prisma.user.findUnique({
          where: { id: assignedToId },
        });
        if (staff) {
          assigneeName = staff.name;
        }
      }
      auditLogs.push(`Lead assigned to: ${assigneeName}`);
    }

    // 3. Update database
    const updatedLead = await prisma.lead.update({
      where: { id },
      data: updateData,
    });

    // 4. Write audit log entries into LeadNote
    for (const logText of auditLogs) {
      await prisma.leadNote.create({
        data: {
          leadId: id,
          authorId: user.id,
          body: `[SYSTEM] ${logText} (by ${user.name})`,
        },
      });
    }

    return NextResponse.json({ lead: updatedLead }, { status: 200 });
  } catch (error: any) {
    console.error('Error in PATCH lead API:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
