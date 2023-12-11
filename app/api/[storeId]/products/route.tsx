import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, price, stock, weight, description, categoryId, vehicleBrandId, vehicleTypeId, productBrandId, images, isFeatured, isArchived } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!stock) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!weight) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!description) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    if (!vehicleBrandId) {
      return new NextResponse("Vehicle brand id is required", { status: 400 });
    }

    if (!vehicleTypeId) {
      return new NextResponse("Vehicle type id is required", { status: 400 });
    }

    if (!productBrandId) {
      return new NextResponse("Product brand id is required", { status: 400 });
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

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        stock,
        weight,
        description,
        isFeatured,
        isArchived,
        categoryId,
        vehicleBrandId,
        vehicleTypeId,
        productBrandId, 
        storeId: params.storeId,
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image),
            ],
          },
        },
      },
    });
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
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
    const categoryId = searchParams.get('categoryId') || undefined;
    const vehicleBrandId = searchParams.get('vehicleBrandId') || undefined;
    const vehicleTypeId = searchParams.get('vehicleTypeId') || undefined;
    const productBrandId = searchParams.get('productBrandId') || undefined;
    const isFeatured = searchParams.get('isFeatured');

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        name: {
          contains: searchQuery, // Use the search query to filter product names
        },
        storeId: params.storeId,
        categoryId,
        vehicleBrandId,
        vehicleTypeId,
        productBrandId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        vehicleBrand: true,
        vehicleType: true,
        productBrand: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
    return NextResponse.json(products, { headers: corsHeaders });
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
