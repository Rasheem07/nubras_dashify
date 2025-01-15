/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import client from "@/database";

export async function POST(req: NextRequest) {
  const { type, month, quarter, half, startDate, endDate, category } =
    await req.json();

  if (!type || !category) {
    return new NextResponse("Missing required fields!", { status: 400 });
  }

  const pg = await client.connect();

  let query = `
    SELECT 
      product,
      SUM("TOTAL AMOUNT") AS total_sales,      
      SUM("PRODUCT QUANTITY") AS total_quantity  
    FROM 
      nubras_database_final1
    WHERE 
      category = $1
  `;

  // Query parameters
  // eslint-disable-next-line prefer-const
  let queryParams: any[] = [category];

  if (type === "single" && startDate) {
    const [year, month, day] = startDate.split("-");
    query += ` AND EXTRACT(YEAR FROM "SALE ORDER DATE") = $2 
               AND EXTRACT(MONTH FROM "SALE ORDER DATE") = $3 
               AND EXTRACT(DAY FROM "SALE ORDER DATE") = $4`;
    queryParams.push(year, month, day);
  } else if (type === "month" && month) {
    query += ` AND EXTRACT(MONTH FROM "SALE ORDER DATE") = $2`;
    queryParams.push(month);
  } else if (type === "quarter" && quarter) {
    const quarterMapping: { [key: string]: string[] } = {
      q1: ["1", "2", "3"],
      q2: ["4", "5", "6"],
      q3: ["7", "8", "9"],
      q4: ["10", "11", "12"],
    };
    query += ` AND EXTRACT(MONTH FROM "SALE ORDER DATE") IN (${quarterMapping[
      quarter
    ]
      .map((month) => `'${month}'`)
      .join(", ")})`;
  } else if (type === "half" && half) {
    const halfMapping: { [key: string]: string[] } = {
      first: ["1", "2", "3", "4", "5", "6"],
      second: ["7", "8", "9", "10", "11", "12"],
    };
    query += ` AND EXTRACT(MONTH FROM "SALE ORDER DATE") IN (${halfMapping[half]
      .map((month) => `'${month}'`)
      .join(", ")})`;
  } else if (type === "year") {
    query += ` AND EXTRACT(YEAR FROM "SALE ORDER DATE") IS NOT NULL`;
  } else if (type === "custom" && startDate && endDate) {
    query += ` AND "SALE ORDER DATE" BETWEEN $2 AND $3`;
    queryParams.push(convertToDateFormat(startDate), convertToDateFormat(endDate));
  } else {
    return new NextResponse("Invalid period type!", { status: 400 });
  }

  
  query += `
    GROUP BY 
      product
    ORDER BY 
      total_sales DESC;
  `;

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
  return `${year}-${month}-${day}`;
}
