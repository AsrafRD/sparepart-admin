import cors from "@/utils/cors";
import runMiddleware from "@/utils/runMiddleware";
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	let endPoint;
	const query = req.query;
	const result = { rajaongkir: {} };

	await runMiddleware(req, res, cors);

	if (req.method === "GET") {
		if (query.hasOwnProperty("provinsiId") === true) {
			endPoint = `https://api.rajaongkir.com/starter/province?key=${process.env.API_KEY}&id=${req.query.provinsiId}`;
		} else {
			endPoint = `https://api.rajaongkir.com/starter/province?key=${process.env.API_KEY}`;
		}

		const response = await fetch(endPoint, { method: "GET" });
		const data = await response.json();
        
        const result: { rajaongkir: { status?: string; results?: any } } = { rajaongkir: {} };

		result.rajaongkir.status = data.rajaongkir.status;
		result.rajaongkir.results = data.rajaongkir.results;
		res.status(200).json(result);
	}
}