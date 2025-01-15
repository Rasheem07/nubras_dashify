/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import client from "@/database";

export async function POST(req: NextRequest) {
  const { type, month, quarter, half, startDate, endDate , location, salesPerson, orderStatus, orderPaymentStatus} = await req.json();

  
  if (!type) {
    return new NextResponse("Missing required fields!", { status: 404 });
  }
  
  const pg = await client.connect();
  
  let query = `
  SELECT EXTRACT(YEAR FROM "SALE ORDER DATE") AS year,
      SUM("TOTAL AMOUNT") AS total_sales,
      COUNT(*) AS total_sales_count
    FROM Nubras_database_final1
  `;
  
  let queryParams: any[] = [];

  if (type === "single") {
    const [m, d] = startDate.split("-");
    query += ` WHERE EXTRACT(MONTH FROM "SALE ORDER DATE") = $1 AND EXTRACT(DAY FROM "SALE ORDER DATE") = $2`;
    queryParams = [m, d];
  } else if (type === "month") {
    query += ` WHERE EXTRACT(MONTH FROM "SALE ORDER DATE") = $1`;
    queryParams = [month];
  } else if (type === "quarter") {
    const quarterMapping: { [key: string]: string } = {
      q1: "1", q2: "2", q3: "3", q4: "4"
    };
    query += ` WHERE EXTRACT(QUARTER FROM "SALE ORDER DATE") = $1`;
    queryParams = [quarterMapping[quarter]];
  } else if (type === "half") {
    const halfMapping: { [key: string]: string[] } = {
      first: ["1", "2", "3", "4", "5", "6"],
      second: ["7", "8", "9", "10", "11", "12"]
    };
    query += ` WHERE EXTRACT(MONTH FROM "SALE ORDER DATE") IN (${halfMapping[half].map((month) => `'${month}'`).join(", ")})`;
  } else if (type === "year") {
    query += ` WHERE EXTRACT(YEAR FROM "SALE ORDER DATE") IS NOT NULL`; // Ensure there's a year
  } else if (type === "custom" && startDate && endDate) {
    const formattedStartDate = convertToDateFormat(startDate);
    const formattedEndDate = convertToDateFormat(endDate);
    
    query += ` WHERE "SALE ORDER DATE" BETWEEN TO_DATE($1, 'YYYY-MM-DD') AND TO_DATE($2, 'YYYY-MM-DD')`;
    queryParams = [formattedStartDate, formattedEndDate];
  } else {
    return new NextResponse("Invalid period type!", { status: 400 });
  }
  
  if (location && location !== "") {
    query += ` AND "CUSTOMER LOCATION" = $${queryParams.length + 1}`;
    queryParams.push(location);
  }
  
  if (salesPerson && salesPerson !== "") {
    query += ` AND "SALES PERSON" = $${queryParams.length + 1}`;
    queryParams.push(salesPerson);
  }
  
  if (orderStatus && orderStatus !== "") {
    query += ` AND "ORDER  STATUS" = $${queryParams.length + 1}`;
    queryParams.push(orderStatus);
  }
  
  if (orderPaymentStatus && orderPaymentStatus !== "") {
    query += ` AND "ORDER PAYMENT STATUS" = $${queryParams.length + 1}`;
    queryParams.push(orderPaymentStatus);
  }
  
  // Ensure the GROUP BY and ORDER BY clauses are added only once
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
