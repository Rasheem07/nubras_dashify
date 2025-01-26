/* eslint-disable @typescript-eslint/no-explicit-any */
import client from "@/database";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const pg = await client.connect();
  const { year, group_id, phone_number, min_total } = await req.json();

  // Initialize the base query
  let query = `
    SELECT
      *
    FROM 
      "Nubras updated database"
  `;

  const conditions: string[] = [];
  const params: any[] = [];

  // Add filters if they are provided
  if (year && year !== "") {
    conditions.push(`EXTRACT(YEAR FROM sale_date) = $${params.length + 1}`);
    params.push(year);
  }

  if (group_id && group_id !== "") {
    conditions.push(`group_id = $${params.length + 1}`);
    params.push(group_id);
  }

  if (phone_number && phone_number !== "") {
    conditions.push(`phone_number = $${params.length + 1}`);
    params.push(phone_number);
  }

  // Add WHERE clause if any condition exists
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  // Add the condition for min_total directly in WHERE clause without aggregation
  if (min_total && min_total !== "") {
    query += ` AND total_amount >= $${params.length + 1}`;
    params.push(min_total);
  }

  // Add ORDER BY clause
  query += `
    ORDER BY 
      total_amount;
  `;

  console.log(query)

  try {
    // Execute the query
    const data = await pg.query(query, params);
    return new Response(JSON.stringify(data.rows), { status: 200 });
  } catch (error) {
    console.error("Error executing query:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), { status: 500 });
  } finally {
    pg.release();
  }
}
