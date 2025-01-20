/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import client from "@/database";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { category, branch, date } = await req.json();
    console.log("Received Data:", category, branch, date); // Log incoming data

    let params: any[] = [category];

    let query = "SELECT * FROM nubras WHERE nubras_product_catogories = $1";

    if (date && date !== "") {
      // Using parameterized query for date instead of direct string interpolation
      query += ` AND sale_order_date::date = $${params.length + 1}`;
      params.push(date);
    }

    // Conditionally add filters based on provided data
    if (branch && branch !== "") {
      query += ` AND nubras_branch = $${params.length + 1}`;
      params.push(branch);
    }

    console.log("Constructed Query:", query); // Log constructed query
    console.log("Query Parameters:", params); // Log query params

    // Connect to the database
    const pg = await client.connect();

    try {
      // Execute the query
      const result = await pg.query(query, params);

      // Log query result
      console.log("Query Result:", result.rows);

      // Return the result
      if (result.rows.length === 0) {
        return new Response("No data found", { status: 404 });
      }

      return new Response(JSON.stringify(result.rows), { status: 200 });
    } catch (error) {
      console.error("Query execution error:", error);
      return new Response("Internal Server Error", { status: 500 });
    } finally {
      // Always release the client after use
      pg.release();
    }
  } catch (error) {
    console.error("Error parsing request body:", error);
    return new Response("Invalid JSON", { status: 400 });
  }
}
