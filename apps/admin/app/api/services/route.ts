import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@consultax/db';
import { verifyToken } from '../../../lib/jwt';

// Helper to check for Super Admin rights
async function isSuperAdmin(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return false;
  const user = await verifyToken(token);
  return user && user.role === 'SUPER_ADMIN';
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const services = await prisma.serviceCategory.findMany({
      include: {
        subServices: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json({ services }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching services in API:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isSuperAdmin(req))) {
      return NextResponse.json({ error: 'Forbidden. Super Admin only.' }, { status: 403 });
    }

    const { name, slug, description, order } = await req.json();

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required.' }, { status: 400 });
    }

    const existing = await prisma.serviceCategory.findUnique({
      where: { slug: slug.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json({ error: 'Service with this slug already exists.' }, { status: 400 });
    }

    const newService = await prisma.serviceCategory.create({
      data: {
        name: name.trim(),
        slug: slug.toLowerCase().trim(),
        description: description ? description.trim() : null,
        order: typeof order === 'number' ? order : 0,
      },
    });

    return NextResponse.json({ service: newService }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!(await isSuperAdmin(req))) {
      return NextResponse.json({ error: 'Forbidden. Super Admin only.' }, { status: 403 });
    }

    const { id, name, description, order, active, subServices } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Service ID is required.' }, { status: 400 });
    }

    // Update parent service category
    const updatedCategory = await prisma.serviceCategory.update({
      where: { id },
      data: {
        name: name ? name.trim() : undefined,
        description: description !== undefined ? (description ? description.trim() : null) : undefined,
        order: typeof order === 'number' ? order : undefined,
        active: typeof active === 'boolean' ? active : undefined,
      },
    });

    // Update subservices list if provided
    if (Array.isArray(subServices)) {
      // Clean delete existing subservices and reload
      await prisma.subService.deleteMany({
        where: { categoryId: id },
      });

      for (let i = 0; i < subServices.length; i++) {
        const subName = subServices[i];
        if (subName && typeof subName === 'string' && subName.trim().length > 0) {
          await prisma.subService.create({
            data: {
              categoryId: id,
              name: subName.trim(),
              order: i + 1,
            },
          });
        }
      }
    }

    const fullUpdatedCategory = await prisma.serviceCategory.findUnique({
      where: { id },
      include: { subServices: true },
    });

    return NextResponse.json({ service: fullUpdatedCategory }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!(await isSuperAdmin(req))) {
      return NextResponse.json({ error: 'Forbidden. Super Admin only.' }, { status: 403 });
    }

    const { searchParams } = req.nextUrl;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Service ID is required.' }, { status: 400 });
    }

    // Delete child subservices first
    await prisma.subService.deleteMany({
      where: { categoryId: id },
    });

    // Delete category
    await prisma.serviceCategory.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Service deleted successfully.' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
