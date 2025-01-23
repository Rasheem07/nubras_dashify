/* eslint-disable @typescript-eslint/no-explicit-any */
import client from "@/database";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { year } = await req.json();

  let query = `
    SELECT 
      CONCAT(EXTRACT(YEAR FROM sale_order_date), '-H', CASE 
        WHEN EXTRACT(MONTH FROM sale_order_date) <= 6 THEN 1 
        ELSE 2 
      END) AS half_year,
      COUNT(*) AS total_orders,
      ROUND(CAST(AVG(total_amount) AS NUMERIC), 2) AS "Average sales amount",
      ROUND(CAST(SUM(total_amount) AS NUMERIC), 2) AS "Total sales amount",
      ROUND(CAST(SUM(balance_amount) AS NUMERIC), 2) AS "Total balance amount"
    FROM nubras
  `;

  if (year && year !== "") {
    query += " WHERE EXTRACT(YEAR FROM sale_order_date) = $1";
  }

  query += `
    GROUP BY EXTRACT(YEAR FROM sale_order_date), 
      CASE 
        WHEN EXTRACT(MONTH FROM sale_order_date) <= 6 THEN 1 
        ELSE 2 
      END
    ORDER BY EXTRACT(YEAR FROM sale_order_date), 
      CASE 
        WHEN EXTRACT(MONTH FROM sale_order_date) <= 6 THEN 1 
        ELSE 2 
      END
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
