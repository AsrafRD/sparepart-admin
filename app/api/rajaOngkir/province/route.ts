import { NextResponse, NextRequest } from "next/server";
import axios from 'axios';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders }) ;
}

export async function GET(req: NextRequest) {
  try {
    const response = await axios.get('https://api.rajaongkir.com/starter/province', {
    //   params: { id: '12' },
    headers: { 
        key: process.env.RAJA_ONGKIR_API_KEY 
    }, // Ganti 'your-api-key' dengan kunci API Anda
    });

    // console.log("respnse provinsi", response.data)
    // const data = response.data

    // Gunakan NextResponse untuk mengirim respons JSON
    return NextResponse.json(response.data, { headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// export { GET as default };
