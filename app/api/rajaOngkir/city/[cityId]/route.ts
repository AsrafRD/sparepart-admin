import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { provinceId: string } }
) {
  try {
    if (!params.provinceId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const response = await axios.get('https://api.rajaongkir.com/starter/city', {
      params: { 
        province: params.provinceId,
    },
      headers: { 
        key: process.env.RAJA_ONGKIR_API_KEY 
    }, // Ganti 'your-api-key' dengan kunci API Anda
    });
    
    const data = response.data

    return NextResponse.json(data);
  } catch (error) {
    console.log('[BILLBOARD_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
