// import cors from "@/utils/cors";
// import runMiddleware from "@/utils/runMiddleware";
// import { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     await runMiddleware(req, res, cors);

//     if (req.method === "POST") {
//         const response = await fetch("https://api.rajaongkir.com/starter/cost", {
//             method: "POST",
//             headers: {
//                 key: process.env.API_KEY || '', // Menggunakan || '' untuk menghindari kunci yang mungkin undefined
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(req.body), // Mengonversi body ke string JSON
//         });
        
//         const result = await response.json();
//         res.status(200).json(result);
//     }
// }