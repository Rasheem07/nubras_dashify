import { NextRequest } from "next/server";
import client from "@/database"; // Assuming your database client is set up

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Parse the request body
    const { date } = body; // Extract the selected date from the body

    if (!date) {
      return new Response("Selected date is required", { status: 400 });
    }

    const query = `
      WITH current_month_data AS (
        SELECT product_categories, SUM(total_amount) AS "Current Month Total"
        FROM nubras
        WHERE date_part('year', sale_order_date) = date_part('year', CURRENT_DATE)
          AND date_part('month', sale_order_date) = date_part('month', CURRENT_DATE)
        GROUP BY product_categories
      ),
      selected_date_data AS (
        SELECT product_categories, SUM(total_amount) AS "Selected Date Total"
        FROM nubras
        WHERE DATE(sale_order_date) = $1
        GROUP BY product_categories
      )
      SELECT
        n.product_categories AS "Product Category",
        SUM(n.total_amount) AS "Category Total",
        COALESCE(cm."Current Month Total", 0) AS "Current Month Total",
        COALESCE(sd."Selected Date Total", 0) AS "Selected Date Total"
      FROM nubras n
      LEFT JOIN current_month_data cm
        ON n.product_categories = cm.product_categories
      LEFT JOIN selected_date_data sd
        ON n.product_categories = sd.product_categories
      GROUP BY n.product_categories, cm."Current Month Total", sd."Selected Date Total";
    `;

    // Execute the query
    const { rows } = await client.query(query, [date]);

    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("Database query error", error);
    return new Response("An error occurred", { status: 500 });
  }
}
