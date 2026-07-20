import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@consultax/db';
import { verifyToken } from '@/lib/jwt';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const { body: noteBody } = await req.json();
    if (!noteBody || typeof noteBody !== 'string' || noteBody.trim().length === 0) {
      return NextResponse.json(
        { error: 'Note content is required.' },
        { status: 400 }
      );
    }

    // 3. Create lead note
    const note = await prisma.leadNote.create({
      data: {
        leadId: id,
        authorId: user.id,
        body: noteBody.trim(),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ note }, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST lead note API:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
