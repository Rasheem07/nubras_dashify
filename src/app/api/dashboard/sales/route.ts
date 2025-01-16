/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
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
  differenceInCalendarMonths,
  differenceInCalendarQuarters,
} from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const date = url.searchParams.get("date") || ""; // Default to empty string if no date is provided
  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");

  const { category, location, salesPerson, orderStatus, orderPaymentStatus } = await req.json();
  const pg = await client.connect();

  let query = `SELECT `;
  let groupBy = "";
  let params: any[] = [];
  let whereClauseAdded = false;

  // Determine date range and grouping logic
  if (date === "year") {
    const startYear = startOfYear(new Date());
    const endYear = endOfYear(new Date());
    query += `
      DATE_TRUNC('month', "SALE ORDER DATE") AS period, 
      SUM("TOTAL AMOUNT") AS total_amount, 
      COUNT(*) AS count
    `;
    groupBy = "GROUP BY period ORDER BY period";
    params.push(startYear, endYear);
    query += ` FROM Nubras_database_final1 WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date`;
    whereClauseAdded = true;
  } else if (date === "month") {
    const startMonth = startOfMonth(new Date());
    const endMonth = endOfMonth(new Date());
    query += `
      DATE_TRUNC('day', "SALE ORDER DATE") AS period, 
      SUM("TOTAL AMOUNT") AS total_amount, 
      COUNT(*) AS count
    `;
    groupBy = "GROUP BY period ORDER BY period";
    params.push(startMonth, endMonth);
    query += ` FROM Nubras_database_final1 WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date`;
    whereClauseAdded = true;
  } else if (date === "quarter") {
    const startQuarter = startOfQuarter(new Date());
    const endQuarter = endOfQuarter(new Date());
    query += `
      DATE_TRUNC('week', "SALE ORDER DATE") AS period, 
      SUM("TOTAL AMOUNT") AS total_amount, 
      COUNT(*) AS count
    `;
    groupBy = "GROUP BY period ORDER BY period";
    params.push(startQuarter, endQuarter);
    query += ` FROM Nubras_database_final1 WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date`;
    whereClauseAdded = true;
  } else if (date === "week") {
    const startWeekDate = startOfWeek(new Date(), { weekStartsOn: 0 }); // Start of the current week (Sunday)
    const endWeekDate = endOfWeek(new Date(), { weekStartsOn: 0 }); // End of the current week (Saturday)
    query += `
      DATE_TRUNC('day', "SALE ORDER DATE") AS period, 
      SUM("TOTAL AMOUNT") AS total_amount, 
      COUNT(*) AS count
    `;
    groupBy = "GROUP BY period ORDER BY period";
    params.push(startWeekDate, endWeekDate);
    query += ` FROM Nubras_database_final1 WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date`;
    whereClauseAdded = true;
  } else if (date === "custom" && start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Validate dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid start or end date" },
        { status: 400 }
      );
    }

    // Calculate grouping based on the custom range
    const monthsDifference = differenceInCalendarMonths(endDate, startDate);
    const quartersDifference = differenceInCalendarQuarters(endDate, startDate);

    if (monthsDifference > 3 && monthsDifference <= 12) {
      query += `
        DATE_TRUNC('week', "SALE ORDER DATE") AS period, 
        SUM("TOTAL AMOUNT") AS total_amount, 
        COUNT(*) AS count
      `;
      groupBy = "GROUP BY period ORDER BY period";
    } else if (quartersDifference > 1) {
      query += `
        DATE_TRUNC('month', "SALE ORDER DATE") AS period, 
        SUM("TOTAL AMOUNT") AS total_amount, 
        COUNT(*) AS count
      `;
      groupBy = "GROUP BY period ORDER BY period";
    } else {
      query += `
        DATE_TRUNC('day', "SALE ORDER DATE") AS period, 
        SUM("TOTAL AMOUNT") AS total_amount, 
        COUNT(*) AS count
      `;
      groupBy = "GROUP BY period ORDER BY period";
    }
    params.push(startDate, endDate);
    query += ` FROM Nubras_database_final1 WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date`;
    whereClauseAdded = true;
  } else {
    // Default behavior for invalid or missing date
    query += `
      DATE_TRUNC('month', "SALE ORDER DATE") AS period, 
      SUM("TOTAL AMOUNT") AS total_amount, 
      COUNT(*) AS count
    `;
    groupBy = "GROUP BY period ORDER BY period";
    query += ` FROM Nubras_database_final1`; // No date filter
  }

  // Add dynamic filters (only append "AND" if filters exist)
  let filterIndex = params.length + 1;

  if (category) {
    if (!whereClauseAdded) {
      query += ` WHERE "category" = $${filterIndex}`;
      whereClauseAdded = true;
    } else {
      query += ` AND "category" = $${filterIndex}`;
    }
    params.push(category);
    filterIndex++;
  }

  if (location) {
    if (!whereClauseAdded) {
      query += ` WHERE "CUSTOMER LOCATION" = $${filterIndex}`;
      whereClauseAdded = true;
    } else {
      query += ` AND "CUSTOMER LOCATION" = $${filterIndex}`;
    }
    params.push(location);
    filterIndex++;
  }

  if (salesPerson) {
    if (!whereClauseAdded) {
      query += ` WHERE "SALES PERSON" = $${filterIndex}`;
      whereClauseAdded = true;
    } else {
      query += ` AND "SALES PERSON" = $${filterIndex}`;
    }
    params.push(salesPerson);
    filterIndex++;
  }

  if (orderStatus) {
    if (!whereClauseAdded) {
      query += ` WHERE "ORDER  STATUS" = $${filterIndex}`;
      whereClauseAdded = true;
    } else {
      query += ` AND "ORDER  STATUS" = $${filterIndex}`;
    }
    params.push(orderStatus);
    filterIndex++;
  }

  if (orderPaymentStatus) {
    if (!whereClauseAdded) {
      query += ` WHERE "ORDER PAYMENT STATUS" = $${filterIndex}`;
      whereClauseAdded = true;
    } else {
      query += ` AND "ORDER PAYMENT STATUS" = $${filterIndex}`;
    }
    params.push(orderPaymentStatus);
    filterIndex++;
  }

  // Finalize query with grouping and sorting
  query += ` ${groupBy}`;

  try {
    // Debugging: Log the final query and parameters
    console.log("Final Query:", query);
    console.log("Parameters:", params);

    // Execute query
    const result = await pg.query(query, params);
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error: any) {
    console.error("Error executing query:", error.stack);
    return NextResponse.json(
      { error: "Failed to fetch data", message: error.message },
      { status: 500 }
    );
  } finally {
    await pg.release();
  }
}
