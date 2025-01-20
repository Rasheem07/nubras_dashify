/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import client from "@/database";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { branch, year, month } = await req.json();
    let params: any[] = ["NUBRAS GENTS JACKET SECTION"];

    let query = 'SELECT  * FROM nubras WHERE nubras_product_catogories = $1';
    

    // Conditionally add filters based on provided data
    if (branch) {
      query += ` AND nubras_branch = $${params.length + 1}`;
      params.push(branch);
    }

    if (year) {
      query += ` AND EXTRACT(YEAR from sale_order_date) = $${params.length + 1}`;
      params.push(year);
    }

    if (month) {
      query += ` AND EXTRACT(MONTH from sale_order_date) = $${params.length + 1}`;
      params.push(month);
    }
    // Connect to the database
    const pg = await client.connect();

    try {
      // Execute the query
      const result = await pg.query(query, params);

      // Return the result
      if (result.rows.length === 0) {
        return new Response('No data found', { status: 404 });
      }

      return new Response(JSON.stringify(result.rows), { status: 200 });
    } catch (error) {
      console.error('Query execution error:', error);
      return new Response('Internal Server Error', { status: 500 });
    } finally {
      // Always release the client after use
      pg.release();
    }
  } catch (error) {
    console.error('Error parsing request body:', error);
    return new Response('Invalid JSON', { status: 400 });
  }
}
