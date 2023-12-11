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
    const provinceId = informasi.provinceId;
    // console.log(" data yang di terima", provinceId);
    const response = await axios.get(
      "https://api.rajaongkir.com/starter/city",
      {
        params: {
          province: provinceId,
        },
        headers: {
          key: process.env.RAJA_ONGKIR_API_KEY,
        }, // Ganti 'your-api-key' dengan kunci API Anda
      }
    );

    const data = response.data;

    // const cityNames = response.data.rajaongkir.results.map(
    //   (city: { city_name: any }) => city.city_name
    // );
    // console.log("data kota yang akan dikirim ke klien", cityNames);

    return NextResponse.json(response.data, { headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}


// export async function GET(req: NextRequest) {
//   try {
//     // const informasi = await req.json();
//     // const provinceId = informasi.provinceId;
//     // console.log(" data yang di terima", provinceId);
//     const response = await axios.get(
//       "https://api.rajaongkir.com/starter/city",
//       {
//         params: {
//           province: provinceId,
//         },
//         headers: {
//           key: process.env.RAJA_ONGKIR_API_KEY,
//         }, // Ganti 'your-api-key' dengan kunci API Anda
//       }
//     );

//     const data = response.data;

//     const cityNames = response.data.rajaongkir.results.map(
//       (city: { city_name: any }) => city.city_name
//     );
//     console.log("data kota yang akan dikirim ke klien", cityNames);

//     return NextResponse.json(response.data, { headers: corsHeaders });
//   } catch (error) {
//     console.error(error);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }
