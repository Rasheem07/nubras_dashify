/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/data/download/route.ts
import client from "@/database";
import * as XLSX from "xlsx"; // Import XLSX library for export functionality
import { NextRequest, NextResponse } from "next/server";
import { startOfYear, endOfYear, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfQuarter, endOfQuarter } from "date-fns";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const name = url.searchParams.get("name");
  const date = url.searchParams.get("date") || "";

  const { category, location, salesPerson, orderStatus, orderPaymentStatus } = await req.json();

  const pg = await client.connect();

  let query = `SELECT * FROM ${name}`;
  // eslint-disable-next-line prefer-const
  let params: any[] = [];
  let whereClauseAdded = false; // To track if the WHERE clause has been added

  // Apply date filters based on the query parameter
  if (date === "year") {
    const startYear = startOfYear(new Date());
    const endYear = endOfYear(new Date());
    query += ' WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
    params.push(startYear, endYear);
    whereClauseAdded = true;
  } else if (date === "month") {
    const startMonth = startOfMonth(new Date());
    const endMonth = endOfMonth(new Date());
    if (!whereClauseAdded) {
      query += ' WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
    } else {
      query += ' AND "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
    }
    params.push(startMonth, endMonth);
    whereClauseAdded = true;
  } else if (date === "quarter") {
    const startQuarter = startOfQuarter(new Date());
    const endQuarter = endOfQuarter(new Date());
    if (!whereClauseAdded) {
      query += ' WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
    } else {
      query += ' AND "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
    }
    params.push(startQuarter, endQuarter);
    whereClauseAdded = true;
  } else if (date === "week") {
    const startWeekDate = startOfWeek(new Date(), { weekStartsOn: 0 });
    const endWeekDate = endOfWeek(new Date(), { weekStartsOn: 0 });
    if (!whereClauseAdded) {
      query += ' WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
    } else {
      query += ' AND "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
    }
    params.push(startWeekDate, endWeekDate);
    whereClauseAdded = true;
  }

  // Apply location filter
  if (location && location !== "") {
    if (!whereClauseAdded) {
      query += ` WHERE "CUSTOMER LOCATION" = $${params.length + 1}`;
      whereClauseAdded = true;
    } else {
      query += ` AND "CUSTOMER LOCATION" = $${params.length + 1}`;
    }
    params.push(location);
  }

  // Apply salesPerson filter
  if (salesPerson && salesPerson !== "") {
    if (!whereClauseAdded) {
      query += ` WHERE "SALES PERSON" = $${params.length + 1}`;
      whereClauseAdded = true;
    } else {
      query += ` AND "SALES PERSON" = $${params.length + 1}`;
    }
    params.push(salesPerson);
  }

  // Apply orderStatus filter
  if (orderStatus && orderStatus !== "") {
    if (!whereClauseAdded) {
      query += ` WHERE "ORDER STATUS" = $${params.length + 1}`;
      whereClauseAdded = true;
    } else {
      query += ` AND "ORDER STATUS" = $${params.length + 1}`;
    }
    params.push(orderStatus);
  }

  // Apply orderPaymentStatus filter
  if (orderPaymentStatus && orderPaymentStatus !== "") {
    if (!whereClauseAdded) {
      query += ` WHERE "ORDER PAYMENT STATUS" = $${params.length + 1}`;
      whereClauseAdded = true;
    } else {
      query += ` AND "ORDER PAYMENT STATUS" = $${params.length + 1}`;
    }
    params.push(orderPaymentStatus);
  }

  // Apply category filter
  if (category && category !== "") {
    if (!whereClauseAdded) {
      query += ` WHERE "category" = $${params.length + 1}`;
      whereClauseAdded = true;
    } else {
      query += ` AND "category" = $${params.length + 1}`;
    }
    params.push(category);
  }

  try {
    // Query the data to export
    const result = await pg.query(query, params);

    // Convert result rows to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(result.rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    // Generate and send the file as an Excel (.xlsx) download
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="data_${name}_${date}.xlsx"`,
      },
    });
  } catch (error: any) {
    console.error("Error generating download:", error);
    return NextResponse.json({ error: "Failed to generate download", message: error.message }, { status: 500 });
  } finally {
    await pg.release();
  }
}
