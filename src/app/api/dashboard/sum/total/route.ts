/* eslint-disable @typescript-eslint/no-explicit-any */
import client from "@/database";

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { type, month, quarter, half, startDate, endDate, year } = await req.json();

    // Validate the input
    if (!type || !year) {
      return new Response("Missing required fields!", { status: 400 });
    }

    // Get the input year and the previous year
    const inputYear = year;
    const previousYear = inputYear - 1;

    let query = `
      SELECT
        EXTRACT(YEAR FROM "SALE ORDER DATE") AS year,
        SUM("TOTAL AMOUNT") AS total_sum,
        SUM("TAX AMOUNT") AS tax_sum,
        SUM("VISA PAYMENT") as visa_amount,
        SUM("BANK TRANSFER PAYMENT") as bank_transfer_amount,
        SUM("CASH PAYMENT") as cash_payment,
        SUM("ADVANCE AMOUNT PAYMENT") as advance_payment,
        SUM("AMOUNT EXCLUDING TAX") as excl_tax_sum,
        SUM("BALANCE AMOUNT") as balance
      FROM Nubras_database_final1
      WHERE EXTRACT(YEAR FROM "SALE ORDER DATE") IN ($1, $2)
    `;

    // eslint-disable-next-line prefer-const
    let queryParams: any[] = [inputYear, previousYear];

    // Define quarter and half mappings
    const quarterMapping: { [key: string]: string } = {
      q1: "1",
      q2: "2",
      q3: "3",
      q4: "4",
    };

    const halfMapping: { [key: string]: string[] } = {
      first: ["1", "2", "3", "4", "5", "6"],
      second: ["7", "8", "9", "10", "11", "12"],
    };

    // Add filters based on the 'type' parameter and other inputs
    if (type === "month") {
      query += ` AND EXTRACT(MONTH FROM "SALE ORDER DATE") = $3`;
      queryParams.push(month);
    } else if (type === "quarter") {
      if (!quarter || !quarterMapping[quarter]) {
        return new Response("Invalid quarter type!", { status: 400 });
      }
      query += ` AND EXTRACT(QUARTER FROM "SALE ORDER DATE") = $3`;
      queryParams.push(quarterMapping[quarter]);
    } else if (type === "half") {
      if (!half || !halfMapping[half]) {
        return new Response("Invalid half type!", { status: 400 });
      }
      query += ` AND EXTRACT(MONTH FROM "SALE ORDER DATE") IN (${halfMapping[half]
        .map((month) => `'${month}'`)
        .join(", ")})`;
    } else if (type === "custom" && startDate && endDate) {
      // Ensure the dates are in the correct format for PostgreSQL ('YYYY-MM-DD')
      const formattedStartDate = formatDateForPostgreSQL(startDate);
      const formattedEndDate = formatDateForPostgreSQL(endDate);

      query += ` AND "SALE ORDER DATE" BETWEEN TO_DATE($3, 'YYYY-MM-DD') AND TO_DATE($4, 'YYYY-MM-DD')`;
      queryParams.push(formattedStartDate, formattedEndDate);
    }

    query += ` GROUP BY EXTRACT(YEAR FROM "SALE ORDER DATE") ORDER BY year DESC`;

    const pg = await client.connect();
    // Execute the query
    const result = await pg.query(query, queryParams);

    await pg.release();
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error calculating aggregates:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  } finally {
    // Release connection back to the pool (if necessary)
  }
}

// Helper function to format date as 'YYYY-MM-DD'
function formatDateForPostgreSQL(date: string): string {
  const dateParts = date.split("-");
  // Assuming the incoming date is in MM-DD format, we'll prepend the current year
  const currentYear = new Date().getFullYear();
  return `${currentYear}-${dateParts[0]}-${dateParts[1]}`;
}
