import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { kode, name } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!kode) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const indication = await prismadb.indication.create({
      data: {
        kode,
        name,
        storeId: params.storeId,
      },
    });
  
    return NextResponse.json(indication);
  } catch (error) {
    console.log('[indicationS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {

  try {
    const url = req.url;
    
    if (!url) {
      return new NextResponse("URL is undefined", { status: 500 });
    }

    const { searchParams } = new URL(url)
    const searchQuery = searchParams?.get('q') || '';

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const indications = await prismadb.indication.findMany({
      where: {
        name: {
          contains: searchQuery, // Use the search query to filter indication names
        },
        storeId: params.storeId
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
  
    return NextResponse.json(indications);
  } catch (error) {
    console.log('[indicationS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
