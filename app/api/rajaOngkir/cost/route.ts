import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// let provinceId: string | undefined;

export async function POST(req: NextRequest) {
  try {
    const informasi = await req.json();
    const destination = informasi.destination;
    const weight = informasi.weight;
    const courier = informasi.courier;
    const origin = 249;

    // console.error("origin yang dipilih :", origin);
    // console.error("City yang dipilih :", destination);
    // console.error("Kurir yang dipilih :", courier);
    // console.error("berat yang ditentukan :", weight);

    const response = await axios.post(
      "https://api.rajaongkir.com/starter/cost",
      {
        origin: origin,
        destination: destination,
        weight: weight,
        courier: courier,
      },
      {
        headers: {
          key: process.env.RAJA_ONGKIR_API_KEY,
          'content-type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const cityNames = response.data.rajaongkir.results.map(
      (city: { costs: any }) => city.costs
    );
    // console.log("data kota yang akan dikirim ke klien", cityNames);

    return NextResponse.json(response.data, { headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
