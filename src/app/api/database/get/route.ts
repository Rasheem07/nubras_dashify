// app/api/data/route.ts
import client from "@/database";
import {
  endOfYear,
  startOfYear,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfQuarter,
  endOfQuarter,
} from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const name = url.searchParams.get("name");
  const date = url.searchParams.get("date") || ""; // Default to empty string if no date is provided
  const page = parseInt(url.searchParams.get("page") || "1");
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10");
  const offset = (page - 1) * pageSize;

  const pg = await client.connect();

  let query = `SELECT * FROM ${name}`;
  let countQuery = `SELECT COUNT(*) FROM ${name}`; // Count query without pagination
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, prefer-const
  let params: any[] = [];

  // Apply date filters based on the query parameter
  if (date === "year") {
    const startYear = startOfYear(new Date()); // Start of the current year
    const endYear = endOfYear(new Date()); // End of the current year
    query += ' WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date ORDER BY id LIMIT $3 OFFSET $4';
    countQuery += ' WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
    params.push(startYear, endYear);
  } else if (date === "month") {
    const startMonth = startOfMonth(new Date()); // Start of the current month
    const endMonth = endOfMonth(new Date()); // End of the current month
    query += ' WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date ORDER BY id LIMIT $3 OFFSET $4';
    countQuery += ' WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
    params.push(startMonth, endMonth);
  } else if (date === "quarter") {
    const startQuarter = startOfQuarter(new Date()); // Start of the current quarter
    const endQuarter = endOfQuarter(new Date()); // End of the current quarter
    query += ' WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date ORDER BY id LIMIT $3 OFFSET $4';
    countQuery += ' WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
    params.push(startQuarter, endQuarter);
  } else if (date === "week") {
    const startWeekDate = startOfWeek(new Date(), { weekStartsOn: 0 }); // Start of the current week (Sunday)
    const endWeekDate = endOfWeek(new Date(), { weekStartsOn: 0 }); // End of the current week (Saturday)
    query += ' WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date ORDER BY id LIMIT $3 OFFSET $4';
    countQuery += ' WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
    params.push(startWeekDate, endWeekDate);
  } else {
    query += ' ORDER BY id LIMIT $1 OFFSET $2';
  }

  // For pagination, the same params are added to both queries
  const paginatedParams = [...params, pageSize, offset];

  try {
    // Query the data for the current page
    const result = await pg.query(query, paginatedParams);

    // Query the count of all records with the applied filter (no pagination for count)
    const countResult = await pg.query(countQuery, params);

    // Use countResult.rows[0].count to get the total filtered record count
    const totalCount = parseInt(countResult.rows[0].count);

    return NextResponse.json(
      {
        data: result.rows,
        totalCount, // Send the total filtered count to frontend
      },
      { status: 200 }
    );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error.stack);
    return NextResponse.json(
      { error: "Failed to fetch data", message: error.message },
      { status: 500 }
    );
  } finally {
    await pg.release();
  }
}
