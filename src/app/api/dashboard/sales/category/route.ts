/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import client from "@/database";

export async function POST(req: NextRequest) {
  const { type, month, quarter, half, startDate, endDate, category } = await req.json();

  if (!type || !category) {
    return new NextResponse("Missing required fields!", { status: 400 });
  }

  const pg = await client.connect();

  let query = `
    SELECT EXTRACT(YEAR FROM "SALE ORDER DATE") AS year,
      SUM("TOTAL AMOUNT") AS total_sales,
      COUNT(*) AS total_sales_count
    FROM Nubras_database_final1
    WHERE "category" = $1
  `;

  // Query parameters
  // eslint-disable-next-line prefer-const
  let queryParams: any[] = [category];

  if (type === "single") {
    const [m, d] = startDate.split("-");
    query += ` AND EXTRACT(MONTH FROM "SALE ORDER DATE") = $2 AND EXTRACT(DAY FROM "SALE ORDER DATE") = $3`;
    queryParams.push(m, d);
  } else if (type === "month") {
    query += ` AND EXTRACT(MONTH FROM "SALE ORDER DATE") = $2`;
    queryParams.push(month);
  } else if (type === "quarter") {
    const quarterMapping: { [key: string]: string } = {
      q1: "1", q2: "2", q3: "3", q4: "4"
    };
    query += ` AND EXTRACT(QUARTER FROM "SALE ORDER DATE") = $2`;
    queryParams.push(quarterMapping[quarter]);
  } else if (type === "half") {
    const halfMapping: { [key: string]: string[] } = {
      first: ["1", "2", "3", "4", "5", "6"],
      second: ["7", "8", "9", "10", "11", "12"]
    };
    query += ` AND EXTRACT(MONTH FROM "SALE ORDER DATE") IN (${halfMapping[half].map((month) => `'${month}'`).join(", ")})`;
  } else if (type === "year") {
    query += ` AND EXTRACT(YEAR FROM "SALE ORDER DATE") IS NOT NULL`;
  } else if (type === "custom" && startDate && endDate) {
    // Fix the date format to match the PostgreSQL date format
    const formattedStartDate = convertToDateFormat(startDate);
    const formattedEndDate = convertToDateFormat(endDate);

    // Adjust query to use the proper date format
    query += ` AND "SALE ORDER DATE" BETWEEN TO_DATE($2, 'YYYY-MM-DD') AND TO_DATE($3, 'YYYY-MM-DD')`;
    queryParams.push(formattedStartDate, formattedEndDate);
  } else {
    return new NextResponse("Invalid period type!", { status: 400 });
  }

  query += ` GROUP BY EXTRACT(YEAR FROM "SALE ORDER DATE") ORDER BY year ASC`;

  try {
    const result = await pg.query(query, queryParams);
    pg.release();
    return new NextResponse(JSON.stringify(result.rows), { status: 200 });
  } catch (error: any) {
    pg.release();
    console.error("Error executing query:", error);
    return new NextResponse("Error executing query", { status: 500 });
  }
}

function convertToDateFormat(date: string): string {
  const [year, month, day] = date.split("-");
  return `${year}-${month}-${day}`; // Ensure it's in 'YYYY-MM-DD' format
}
