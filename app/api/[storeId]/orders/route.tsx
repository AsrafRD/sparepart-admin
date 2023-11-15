import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
  }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Ambil semua order dari database, sesuaikan dengan struktur prismadb.order.findMany
    const orders = await prismadb.order.findMany({
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    
    return res.status(200).json({ orders });
  } catch (error) {
    console.error("[GET_ALL_ORDERS]", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }

  return NextResponse.json(
    {
      headers: corsHeaders,
    }
  );

  
}
