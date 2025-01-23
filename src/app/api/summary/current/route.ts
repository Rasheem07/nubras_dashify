import client from "@/database";
import { NextRequest } from "next/server";

// pages/api/getSalesData.js
export async function POST(req: NextRequest) {
  const { date } = await req.json();
  try {
    // Updated query with the capitalized aliases
    const query = `
      SELECT
        product_categories,
        SUM(total_amount) AS "total_amount"
      FROM nubras
      where sale_order_date = '${date}'
      group by product_categories
    `;

    const paymentQuery = `SELECT invoice_type, SUM(CAST(totals AS NUMERIC)) as "total_amount"
      FROM "Nubras transactions"  where paid_date = '${date}' group by invoice_type`;

    const { rows } = await client.query(query);
    const { rows: rows2 } = await client.query(paymentQuery);
    return new Response(JSON.stringify({ category: rows, payment: rows2 }), {
      status: 200,
    });
  } catch (error) {
    console.error("Database query error", error);
    return new Response("An error occurred", { status: 500 });
  }
}
