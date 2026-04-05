// src/app/api/tools/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/db';
import { geocodeZip, buildGeoFilter, distanceMiles } from '@/lib/geo';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'You must be logged in to list a tool' }, { status: 401 });
    }

    const body = await req.json();
    const {
      name, description, category, subcategory, brand, model, condition,
      dailyRate, depositAmount, weeklyDiscount, monthlyDiscount,
      zipCode, deliveryAvailable, deliveryFee,
      minRentalDays, maxRentalDays, notes,
    } = body;

    if (!name || !description || !category || !condition || !dailyRate || !depositAmount || !zipCode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!/^\d{5}$/.test(zipCode)) {
      return NextResponse.json({ error: 'Invalid ZIP code' }, { status: 400 });
    }

    const geo = await geocodeZip(zipCode);
    if (!geo) {
      return NextResponse.json({ error: 'Could not find location for this ZIP code' }, { status: 400 });
    }

    const userId = (session.user as any).id;

    const tool = await prisma.tool.create({
      data: {
        ownerId:          userId,
        name:             name.trim(),
        description:      description.trim(),
        category,
        subcategory:      subcategory ?? null,
        brand:            brand?.trim() ?? null,
        model:            model?.trim() ?? null,
        condition,
        dailyRate:        Math.round(dailyRate * 100),
        depositAmount:    Math.round(depositAmount * 100),
        weeklyDiscount:   weeklyDiscount ?? null,
        monthlyDiscount:  monthlyDiscount ?? null,
        zipCode,
        city:             geo.city,
        state:            geo.state,
        lat:              geo.lat,
        lng:              geo.lng,
        deliveryAvailable: deliveryAvailable ?? false,
        deliveryFee:      deliveryFee ? Math.round(deliveryFee * 100) : null,
        minRentalDays:    minRentalDays ?? 1,
        maxRentalDays:    maxRentalDays ?? 30,
        notes:            notes?.trim() ?? null,
        available:        true,
      },
    });

    return NextResponse.json({ toolId: tool.id }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/tools]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q        = searchParams.get('q')        ?? '';
    const zip      = searchParams.get('zip')      ?? '';
    const radius   = parseInt(searchParams.get('radius') ?? '25', 10);
    const category = searchParams.get('category') ?? '';
    const minPrice = searchParams.get('minPrice') ?? '';
    const maxPrice = searchParams.get('maxPrice') ?? '';
    const page     = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const pageSize = 12;

    const where: any = { available: true };

    if (q) {
      where.OR = [
        { name:        { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { brand:       { contains: q, mode: 'insensitive' } },
      ];
    }

    if (category) where.category = category;
    if (minPrice)  where.dailyRate = { ...where.dailyRate, gte: parseFloat(minPrice) * 100 };
    if (maxPrice)  where.dailyRate = { ...where.dailyRate, lte: parseFloat(maxPrice) * 100 };

    let geoData = null;
    if (zip && /^\d{5}$/.test(zip)) {
      geoData = await geocodeZip(zip);
      if (geoData) {
        const geoFilter = buildGeoFilter(geoData.lat, geoData.lng, radius);
        where.lat = geoFilter.lat;
        where.lng = geoFilter.lng;
      }
    }

    const [tools, total] = await Promise.all([
      prisma.tool.findMany({
        where,
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          owner:  { select: { id: true, name: true, image: true, stripeAccountStatus: true } },
          _count: { select: { bookings: true, reviews: true } },
        },
        skip:    (page - 1) * pageSize,
        take:    pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.tool.count({ where }),
    ]);

    const toolsWithDistance = tools.map((tool) => ({
      ...tool,
      distanceMiles: geoData
        ? distanceMiles(geoData.lat, geoData.lng, tool.lat, tool.lng)
        : undefined,
    }));

    return NextResponse.json({
      tools:   toolsWithDistance,
      total,
      page,
      pageSize,
      hasMore: page * pageSize < total,
    });
  } catch (error) {
    console.error('[GET /api/tools]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
