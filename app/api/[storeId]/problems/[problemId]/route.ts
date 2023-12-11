import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { problemId: string } }
) {
  try {
    if (!params.problemId) {
      return new NextResponse("problem id is required", { status: 400 });
    }

    const problem = await prismadb.problem.findUnique({
      where: {
        id: params.problemId
      }
    });
  
    return NextResponse.json(problem);
  } catch (error) {
    console.log('[problem_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { problemId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.problemId) {
      return new NextResponse("problem id is required", { status: 400 });
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

    const problem = await prismadb.problem.delete({
      where: {
        id: params.problemId
      },
    });
  
    return NextResponse.json(problem);
  } catch (error) {
    console.log('[problem_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { problemId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { kode, name } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.problemId) {
      return new NextResponse("problem id is required", { status: 400 });
    }

    if (!kode) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
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

    const problem = await prismadb.problem.update({
      where: {
        id: params.problemId
      },
      data: {
        kode,
        name
      },
    });
  
    return NextResponse.json(problem);
  } catch (error) {
    console.log('[problem_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
