// src/app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/db';
import { differenceInCalendarDays } from 'date-fns';

const PLATFORM_FEE_PERCENT = parseInt(process.env.PLATFORM_FEE_PERCENT ?? '15', 10);

function calcPricing(dailyRate: number, depositAmount: number, days: number, weeklyDiscount?: number | null, monthlyDiscount?: number | null) {
  const subtotal       = dailyRate * days;
  let discountPct      = 0;
  if (monthlyDiscount && days >= 30) discountPct = monthlyDiscount / 100;
  else if (weeklyDiscount && days >= 7) discountPct = weeklyDiscount / 100;
  const discountAmount = Math.round(subtotal * discountPct);
  const discounted     = subtotal - discountAmount;
  const platformFee    = Math.round(discounted * (PLATFORM_FEE_PERCENT / 100));
  const ownerEarnings  = discounted - platformFee;
  return {
    subtotal:       discounted,
    discountApplied: discountAmount,
    platformFee,
    ownerEarnings,
    totalCharged:   discounted + depositAmount,
  };
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'You must be logged in to book a tool' }, { status: 401 });
    }

    const { toolId, startDate, endDate, renterNotes } = await req.json();

    if (!toolId || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const start = new Date(startDate);
    const end   = new Date(endDate);

    if (start >= end) {
      return NextResponse.json({ error: 'End date must be after start date' }, { status: 400 });
    }

    const totalDays = differenceInCalendarDays(end, start) + 1;
    const userId    = (session.user as any).id;

    const tool = await prisma.tool.findUnique({ where: { id: toolId } });
    if (!tool)          return NextResponse.json({ error: 'Tool not found' },        { status: 404 });
    if (!tool.available) return NextResponse.json({ error: 'Tool is not available' }, { status: 409 });
    if (tool.ownerId === userId) return NextResponse.json({ error: "You can't book your own tool" }, { status: 400 });

    if (totalDays < tool.minRentalDays || totalDays > tool.maxRentalDays) {
      return NextResponse.json({ error: `Rental must be between ${tool.minRentalDays} and ${tool.maxRentalDays} days` }, { status: 400 });
    }

    const conflict = await prisma.booking.findFirst({
      where: {
        toolId,
        status: { in: ['PAID', 'ACTIVE', 'APPROVED'] },
        AND: [{ startDate: { lte: end } }, { endDate: { gte: start } }],
      },
    });
    if (conflict) {
      return NextResponse.json({ error: 'These dates are already booked' }, { status: 409 });
    }

    const pricing = calcPricing(tool.dailyRate, tool.depositAmount, totalDays, tool.weeklyDiscount, tool.monthlyDiscount);

    const booking = await prisma.booking.create({
      data: {
        toolId,
        renterId:       userId,
        startDate:      start,
        endDate:        end,
        totalDays,
        dailyRate:      tool.dailyRate,
        subtotal:       pricing.subtotal,
        platformFee:    pricing.platformFee,
        ownerEarnings:  pricing.ownerEarnings,
        depositAmount:  tool.depositAmount,
        totalCharged:   pricing.totalCharged,
        discountApplied: pricing.discountApplied,
        status:         'PENDING',
        renterNotes:    renterNotes ?? null,
      },
    });

    return NextResponse.json({ bookingId: booking.id }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/bookings]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const role   = searchParams.get('role') ?? 'renter';
    const userId = (session.user as any).id;

    const bookings = await prisma.booking.findMany({
      where: role === 'owner'
        ? { tool: { ownerId: userId } }
        : { renterId: userId },
      include: {
        tool:   { include: { images: { where: { isPrimary: true }, take: 1 }, owner: { select: { id: true, name: true } } } },
        renter: { select: { id: true, name: true, email: true } },
        review: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('[GET /api/bookings]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
