/* eslint-disable @typescript-eslint/no-explicit-any */
import client from "@/database";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { year } = await req.json();

  let query = `
    SELECT 
      CONCAT(EXTRACT(YEAR FROM sale_order_date), '-Q', EXTRACT(QUARTER FROM sale_order_date)) AS quarter_year,
      COUNT(*) AS total_orders,
      ROUND(CAST(AVG(total_amount_1) AS NUMERIC), 2) AS "Average sales amount",
      ROUND(CAST(SUM(total_amount_1) AS NUMERIC), 2) AS "Total sales amount",
      ROUND(CAST(SUM(balance_amount_1) AS NUMERIC), 2) AS "Total balance amount"
    FROM nubras
  `;

  if (year && year !== "") {
    query += " WHERE EXTRACT(YEAR FROM sale_order_date) = $1";
  }

  query += `
    GROUP BY EXTRACT(YEAR FROM sale_order_date), EXTRACT(QUARTER FROM sale_order_date)
    ORDER BY EXTRACT(YEAR FROM sale_order_date), EXTRACT(QUARTER FROM sale_order_date)
  `;

  const pg = await client.connect();

  try {
    const result = await pg.query(query, year ? [year] : []);
    pg.release();

    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error: any) {
    pg.release();
    return new Response(
      JSON.stringify({ error: "An error occurred", details: error.message }),
      { status: 500 }
    );
  }
}
