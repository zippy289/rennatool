// src/app/api/tools/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tool = await prisma.tool.findUnique({
      where: { id: params.id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        owner: {
          select: {
            id:                 true,
            name:               true,
            image:              true,
            createdAt:          true,
            stripeAccountStatus: true,
          },
        },
        reviews: {
          include: {
            reviewer: { select: { id: true, name: true, image: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        bookings: {
          where: { status: { in: ['PAID', 'ACTIVE', 'APPROVED'] } },
          select: { startDate: true, endDate: true },
        },
        _count: {
          select: { bookings: true, reviews: true },
        },
      },
    });

    if (!tool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    // Increment view count in the background
    prisma.tool.update({
      where: { id: params.id },
      data:  { viewCount: { increment: 1 } },
    }).catch(() => {}); // fire and forget, don't block the response

    return NextResponse.json({ tool });
  } catch (error) {
    console.error('[GET /api/tools/[id]]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const tool = await prisma.tool.update({
      where: { id: params.id },
      data:  body,
    });

    return NextResponse.json({ tool });
  } catch (error) {
    console.error('[PATCH /api/tools/[id]]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.tool.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/tools/[id]]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
