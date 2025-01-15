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
  format,
  getQuarter,
  getWeek,
  differenceInCalendarMonths,
  differenceInCalendarQuarters,
} from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const date = url.searchParams.get("date") || ""; // Default to empty string if no date is provided
    const start = url.searchParams.get("start");
    const end = url.searchParams.get("end");
  
    const pg = await client.connect();
  
    let query = `SELECT `;
    let groupBy = "";
    let params: any[] = [];
  
    // Apply date filters and define grouping logic
    if (date === "year") {
      const startYear = startOfYear(new Date());
      const endYear = endOfYear(new Date());
      query += 'DATE_TRUNC(\'month\', "SALE ORDER DATE") AS period, SUM("TOTAL AMOUNT") AS total_amount, COUNT(*) AS count';
      groupBy = 'GROUP BY period ORDER BY period';
      params.push(startYear, endYear);
      query += ' FROM Nubras_database_final1 WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date ';
    } else if (date === "month") {
      const startMonth = startOfMonth(new Date());
      const endMonth = endOfMonth(new Date());
      query += 'DATE_TRUNC(\'day\', "SALE ORDER DATE") AS period, SUM("TOTAL AMOUNT") AS total_amount, COUNT(*) AS count';
      groupBy = 'GROUP BY period ORDER BY period';
      params.push(startMonth, endMonth);
      query += ' FROM Nubras_database_final1 WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date ';
    } else if (date === "quarter") {
      const startQuarter = startOfQuarter(new Date());
      const endQuarter = endOfQuarter(new Date());
      query += 'DATE_TRUNC(\'week\', "SALE ORDER DATE") AS period, SUM("TOTAL AMOUNT") AS total_amount, COUNT(*) AS count';
      groupBy = 'GROUP BY period ORDER BY period';
      params.push(startQuarter, endQuarter);
      query += ' FROM Nubras_database_final1 WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date ';
    } else if (date === "week") {
      const startWeekDate = startOfWeek(new Date(), { weekStartsOn: 0 }); // Start of the current week (Sunday)
      const endWeekDate = endOfWeek(new Date(), { weekStartsOn: 0 }); // End of the current week (Saturday)
      query += 'DATE_TRUNC(\'day\', "SALE ORDER DATE") AS period, SUM("TOTAL AMOUNT") AS total_amount, COUNT(*) AS count';
      groupBy = 'GROUP BY period ORDER BY period';
      params.push(startWeekDate, endWeekDate);
      query += ' FROM Nubras_database_final1 WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date ';
    } else if (date === "custom" && start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
  
      // Check if the dates are valid
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return NextResponse.json({ error: "Invalid start or end date" }, { status: 400 });
      }
  
      // Calculate the duration between start and end
      const monthsDifference = differenceInCalendarMonths(endDate, startDate);
      const quartersDifference = differenceInCalendarQuarters(endDate, startDate);
  
      // Logic to determine grouping based on the duration
      if (monthsDifference > 3 && monthsDifference <= 12) {
        // If the duration is more than a month but less than or equal to a quarter, group by week
        query += 'DATE_TRUNC(\'day\', "SALE ORDER DATE") AS period, SUM("TOTAL AMOUNT") AS total_amount, COUNT(*) AS count';
        groupBy = 'GROUP BY period ORDER BY period';
      } else if (quartersDifference > 1) {
        // If the duration is more than a quarter, group by month
        query += 'DATE_TRUNC(\'month\', "SALE ORDER DATE") AS period, SUM("TOTAL AMOUNT") AS total_amount, COUNT(*) AS count';
        groupBy = 'GROUP BY period ORDER BY period';
      } else {
        // Default to day grouping for custom date range
        query += 'DATE_TRUNC(\'day\', "SALE ORDER DATE") AS period, SUM("TOTAL AMOUNT") AS total_amount, COUNT(*) AS count';
        groupBy = 'GROUP BY period ORDER BY period';
      }
  
      params.push(startDate, endDate);
      query += ' FROM Nubras_database_final1 WHERE "SALE ORDER DATE" BETWEEN $1::date AND $2::date ';
    } else {
      // Default behavior when date filter is missing or invalid: Return all records, grouped by month
      query += 'DATE_TRUNC(\'month\', "SALE ORDER DATE") AS period, SUM("TOTAL AMOUNT") AS total_amount, COUNT(*) AS count';
      groupBy = 'GROUP BY period ORDER BY period';
      query += ' FROM Nubras_database_final1';  // No date restriction, return all records
    }
  
    // Add grouping to the query
    query += ` ${groupBy}`;
  
    try {
      // Execute the query
      const result = await pg.query(query, params);
  
      // Modify result to display the desired format for year, quarter, and week groupings
      const formattedResult = result.rows.map((row) => {
        if (date === "year") {
          // For yearly grouped data, format as "Month Year"
          const period = new Date(row.period);
          row.period = format(period, "MMMM yyyy"); // "January 2025"
        }
  
        if (date === "quarter") {
          // For quarterly grouped data, format as "Week X of QY YYYY"
          const period = new Date(row.period);
          const quarter = getQuarter(period); // Get quarter number
          const week = getWeek(period); // Get week number within the quarter
          row.period = `Week ${week} of Q${quarter} ${period.getFullYear()}`; // "Week 1 of Q1 2025"
        }
  
        return row;
      });
  
      return NextResponse.json(formattedResult, { status: 200 });
    } catch (error: any) {
      console.log(error.stack);
      return NextResponse.json({ error: "Failed to fetch data", message: error.message }, { status: 500 });
    } finally {
      await pg.release();
    }
  }
  