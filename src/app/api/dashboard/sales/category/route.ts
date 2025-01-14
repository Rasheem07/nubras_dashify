/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import client from "@/database";

export async function POST(req: NextRequest) {
  const { type, month, quarter, half, startDate, endDate , category} = await req.json();

  if (!type) {
    return new NextResponse("Missing required fields!", { status: 404 });
  }

  const pg = await client.connect();

  let query = `
    SELECT EXTRACT(YEAR FROM "Sale Date") AS year,
      SUM("TOTAL AMOUNT") AS total_sales,
      COUNT(*) AS total_sales_count
    FROM Nubras_database
    WHERE "category" = $1
  `;

  // eslint-disable-next-line prefer-const
  let queryParams: any[] = [ category]; // Adjust category as needed

  if (type === "single") {
    const [m, d] = startDate.split("-");
    query += ` AND EXTRACT(MONTH FROM "Sale Date") = $2 AND EXTRACT(DAY FROM "Sale Date") = $3`;
    queryParams.push(m, d);
  } else if (type === "month") {
    query += ` AND EXTRACT(MONTH FROM "Sale Date") = $2`;
    queryParams.push(month);
  } else if (type === "quarter") {
    const quarterMapping: { [key: string]: string } = {
      q1: "1", q2: "2", q3: "3", q4: "4"
    };
    query += ` AND EXTRACT(QUARTER FROM "Sale Date") = $2`;
    queryParams.push(quarterMapping[quarter]);
  } else if (type === "half") {
    const halfMapping: { [key: string]: string[] } = {
      first: ["1", "2", "3", "4", "5", "6"],
      second: ["7", "8", "9", "10", "11", "12"]
    };
    query += ` AND EXTRACT(MONTH FROM "Sale Date") IN (${halfMapping[half].map((month) => `'${month}'`).join(", ")})`;
  } else if (type === "year") {
    query += ` AND EXTRACT(YEAR FROM "Sale Date") IS NOT NULL`; // Ensure there's a year
  } else if (type === "custom" && startDate && endDate) {
    query += ` AND "Sale Date" BETWEEN TO_DATE($2, 'MM-DD') AND TO_DATE($3, 'MM-DD')`;
    queryParams.push(convertToDateFormat(startDate) , convertToDateFormat(endDate));
  } else {
    return new NextResponse("Invalid period type!", { status: 400 });
  }

  query += ` GROUP BY EXTRACT(YEAR FROM "Sale Date") ORDER BY year ASC`;

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

function convertToDateFormat(date: Date | string): string | null {
  const formatted = new Date(date).toLocaleDateString();
  const newDate = formatted.split("/");
  return `${newDate[2]}-${newDate[0]}-${newDate[1]}`;
}
