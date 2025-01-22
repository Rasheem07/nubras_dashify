import client from "@/database";
import { NextRequest } from "next/server";

// pages/api/getSalesData.js
export async function POST(req: NextRequest) {
  const { date } = await req.json();
  try {
    // Updated query with the capitalized aliases
    const query = `
      SELECT
        nubras_product_catogories,
        SUM(total_amount_1) AS "total_amount"
      FROM nubras
      where sale_order_date = '${date}'
      group by nubras_product_catogories
    `;

    const { rows } = await client.query(query);

    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("Database query error", error);
    return new Response("An error occurred", { status: 500 });
  }
}
