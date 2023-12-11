import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // console.log("body", body);
    // Convert selectedIndications to an array of strings
    const selectedIndicationsArray = body.selectedIndications;

    // Find all rules from the database
    const rules = await prismadb.rule.findMany();

    // Calculate Jaccard similarity and find the most similar rule
    // let maxSimilarity = 0;
    // let mostSimilarRule = null;

    const rulesWithSimilarity = rules.map((rule) => {
      const existingKondisiArray = rule.kondisi
        .split(", ")
        .map((item) => item.trim().toLowerCase());
      const selectedIndicationsArrayNormalized = selectedIndicationsArray.map(
        (item: string | undefined) => (item ? item.trim().toLowerCase() : "")
      );
      const intersection = selectedIndicationsArrayNormalized.filter(
        (value: string) => existingKondisiArray.includes(value)
      );
      const union = [
        ...new Set([
          ...selectedIndicationsArrayNormalized,
          ...existingKondisiArray,
        ]),
      ];
      const similarity = intersection.length / union.length;

      // console.log(`
      //   Rule: ${rule.id},
      //   Similarity: ${similarity},
      //   Intersection: ${intersection},
      //   Union: ${union}`);

      return {
        rule,
        similarity,
        intersection,
      };
    });

    // Filter out rules with similarity 0
    const rulesWithNonZeroSimilarity = rulesWithSimilarity.filter(
      (rule) => rule.similarity > 0
    );

    // Sort rules based on similarity in descending order
    const sortedRules = rulesWithNonZeroSimilarity.sort(
      (a, b) => b.similarity - a.similarity
    );

    // Find rules with the highest similarity
    // const highestSimilarity = sortedRules[0]?.similarity;
    // const mostSimilarRules = sortedRules.filter(
    //   (rule) => rule.similarity === highestSimilarity
    // );

    // const hasil = mostSimilarRules.map((entry) => ({
    //   rule: entry.rule,
    //   similarity: entry.similarity,
    //   intersection : entry.intersection,
    // }));

    const hasil = sortedRules.map((entry) => ({
      rule: entry.rule,
      similarity: entry.similarity,
      intersection: entry.intersection,
    }));

    // console.log("Most similar rules:", hasil);

    // Ambil data produk dari tabel produk
    const recommendation = await prismadb.product.findMany();

    // Ambil aturan dengan nilai similaritas paling tinggi
    const mostSimilarRule = sortedRules[0];

    // Ambil kata-kata dari intersection aturan dengan nilai similaritas paling tinggi
    const keywords = [
      ...mostSimilarRule.rule.kondisi
        .split(/\s|,|\.|;/)
        .filter((item) => item.trim() !== ""),
      ...mostSimilarRule.rule.hasil
        .split(/\s|,|\.|;/)
        .filter((item) => item.trim() !== ""),
    ];

    // Cari produk yang memiliki kemiripan kata dengan aturan
    const matchingProductIDs = recommendation
      .filter((product) => {
        const productDescriptionArray = product.description
          .toLowerCase() // Ubah ke huruf kecil
          .split(/\s|,|\.|;/) // Pisahkan berdasarkan spasi, koma, titik, atau titik koma
          .filter((item) => item.trim() !== "");

      //   console.log(`
      // Product: ${product.name}, 
      // Intersection Product: ${productDescriptionArray}`);

      //   console.log(
      //     "Has Intersection:",
      //     keywords.some((keyword: any) =>
      //       productDescriptionArray.includes(keyword.toLowerCase())
      //     )
      //   );

        // Cek apakah setidaknya satu kata dari intersection ada di deskripsi produk
        return keywords.some((keyword: any) =>
          productDescriptionArray.includes(keyword)
        );
      })
      .map((matchingProduct) => matchingProduct.id); // Ambil hanya ID produk

    // console.log("Matching Product IDs:", matchingProductIDs);

    return NextResponse.json(
      { hasil, matchingProductIDs },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("[CHECK_INDICATIONS]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
