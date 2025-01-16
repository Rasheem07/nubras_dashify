/* eslint-disable @typescript-eslint/no-explicit-any */
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

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const name = url.searchParams.get("name");
  const date = url.searchParams.get("date") || "";
  const page = parseInt(url.searchParams.get("page") || "1");
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10");
  const offset = (page - 1) * pageSize;
  const { category, location, salesPerson, orderStatus, orderPaymentStatus } = await req.json();

  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");

  const pg = await client.connect();

  let query = `SELECT * FROM ${name}`;
  let countQuery = `SELECT COUNT(*) FROM ${name}`;
  // eslint-disable-next-line prefer-const
  let params: any[] = [];
  let whereClauseAdded = false; // Flag to track if WHERE clause is added

  // Apply date filters based on the query parameter
  if (date === "year") {
    const startYear = startOfYear(new Date());
    const endYear = endOfYear(new Date());
    if (!whereClauseAdded) {
      query += ' WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
      countQuery += ' WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
      whereClauseAdded = true;
    } else {
      query += ' AND "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
      countQuery += ' AND "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
    }
    params.push(startYear, endYear);
  } else if (date === "month") {
    const startMonth = startOfMonth(new Date());
    const endMonth = endOfMonth(new Date());
    if (!whereClauseAdded) {
      query += ' WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
      countQuery += ' WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
      whereClauseAdded = true;
    } else {
      query += ' AND "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
      countQuery += ' AND "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
    }
    params.push(startMonth, endMonth);
  } else if (date === "quarter") {
    const startQuarter = startOfQuarter(new Date());
    const endQuarter = endOfQuarter(new Date());
    if (!whereClauseAdded) {
      query += ' WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
      countQuery += ' WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
      whereClauseAdded = true;
    } else {
      query += ' AND "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
      countQuery += ' AND "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
    }
    params.push(startQuarter, endQuarter);
  } else if (date === "week") {
    const startWeekDate = startOfWeek(new Date(), { weekStartsOn: 0 });
    const endWeekDate = endOfWeek(new Date(), { weekStartsOn: 0 });
    if (!whereClauseAdded) {
      query += ' WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
      countQuery += ' WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
      whereClauseAdded = true;
    } else {
      query += ' AND "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
      countQuery += ' AND "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
    }
    params.push(startWeekDate, endWeekDate);
  } else if (date === "custom" && start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid start or end date" },
        { status: 400 }
      );
    }

    if (!whereClauseAdded) {
      query += ' WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
      countQuery += ' WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
      whereClauseAdded = true;
    } else {
      query += ' AND "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
      countQuery += ' AND "SALE ORDER DATE" BETWEEN $1::date AND $2::date';
    }
    params.push(startDate, endDate);
  }

  // Apply filters for location, salesPerson, orderStatus, orderPaymentStatus, and category
  if (location && location !== "") {
    if (!whereClauseAdded) {
      query += ` WHERE "CUSTOMER LOCATION" = $${params.length + 1}`;
      countQuery += ` WHERE "CUSTOMER LOCATION" = $${params.length + 1}`;
      whereClauseAdded = true;
    } else {
      query += ` AND "CUSTOMER LOCATION" = $${params.length + 1}`;
      countQuery += ` AND "CUSTOMER LOCATION" = $${params.length + 1}`;
    }
    params.push(location);
  }
  
  if (salesPerson && salesPerson !== "") {
    if (!whereClauseAdded) {
      query += ` WHERE "SALES PERSON" = $${params.length + 1}`;
      countQuery += ` WHERE "SALES PERSON" = $${params.length + 1}`;
      whereClauseAdded = true;
    } else {
      query += ` AND "SALES PERSON" = $${params.length + 1}`;
      countQuery += ` AND "SALES PERSON" = $${params.length + 1}`;
    }
    params.push(salesPerson);
  }
  
  if (orderStatus && orderStatus !== "") {
    if (!whereClauseAdded) {
      query += ` WHERE "ORDER STATUS" = $${params.length + 1}`;
      countQuery += ` WHERE "ORDER STATUS" = $${params.length + 1}`;
      whereClauseAdded = true;
    } else {
      query += ` AND "ORDER STATUS" = $${params.length + 1}`;
      countQuery += ` AND "ORDER STATUS" = $${params.length + 1}`;
    }
    params.push(orderStatus);
  }
  
  if (orderPaymentStatus && orderPaymentStatus !== "") {
    if (!whereClauseAdded) {
      query += ` WHERE "ORDER PAYMENT STATUS" = $${params.length + 1}`;
      countQuery += ` WHERE "ORDER PAYMENT STATUS" = $${params.length + 1}`;
      whereClauseAdded = true;
    } else {
      query += ` AND "ORDER PAYMENT STATUS" = $${params.length + 1}`;
      countQuery += ` AND "ORDER PAYMENT STATUS" = $${params.length + 1}`;
    }
    params.push(orderPaymentStatus);
  }
  
  if (category && category !== "") {
    if (!whereClauseAdded) {
      query += ` WHERE "category" = $${params.length + 1}`;
      countQuery += ` WHERE "category" = $${params.length + 1}`;
      whereClauseAdded = true;
    } else {
      query += ` AND "category" = $${params.length + 1}`;
      countQuery += ` AND "category" = $${params.length + 1}`;
    }
    params.push(category);
  }
  
  // Add LIMIT and OFFSET at the end of the query for pagination
  query += ` ORDER BY id LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(pageSize, offset);

  console.log(query)
  // For countQuery, no pagination parameters should be included
  try {
    // Query the data for the current page
    const result = await pg.query(query, params);

    // Query the count of all records with the applied filter (no pagination for count)
    const countResult = await pg.query(countQuery, params.slice(0, -2)); // Exclude pagination params from count query

    const totalCount = parseInt(countResult.rows[0].count);

    return NextResponse.json(
      {
        data: result.rows,
        totalCount,
      },
      { status: 200 }
    );
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

