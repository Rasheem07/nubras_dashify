// app/api/data/download/route.ts
import client from "@/database";
import * as XLSX from "xlsx"; // Import XLSX library for export functionality
import { NextRequest, NextResponse } from "next/server";
import { startOfYear, endOfYear, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfQuarter, endOfQuarter } from "date-fns";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const name = url.searchParams.get("name");
  const date = url.searchParams.get("date") || "";

  const pg = await client.connect();

  let query = `SELECT * FROM ${name}`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, prefer-const
  let params: any[] = [];

  // Apply date filters based on the query parameter
  if (date === "year") {
    const startYear = startOfYear(new Date());
    const endYear = endOfYear(new Date());
    query += ' WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
    params.push(startYear, endYear);
  } else if (date === "month") {
    const startMonth = startOfMonth(new Date());
    const endMonth = endOfMonth(new Date());
    query += ' WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
    params.push(startMonth, endMonth);
  } else if (date === "quarter") {
    const startQuarter = startOfQuarter(new Date());
    const endQuarter = endOfQuarter(new Date());
    query += ' WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
    params.push(startQuarter, endQuarter);
  } else if (date === "week") {
    const startWeekDate = startOfWeek(new Date(), { weekStartsOn: 0 });
    const endWeekDate = endOfWeek(new Date(), { weekStartsOn: 0 });
    query += ' WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
    params.push(startWeekDate, endWeekDate);
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error generating download:", error);
    return NextResponse.json({ error: "Failed to generate download", message: error.message }, { status: 500 });
  } finally {
    await pg.release();
  }
}
