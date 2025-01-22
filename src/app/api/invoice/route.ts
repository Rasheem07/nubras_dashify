/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import client from "@/database";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { date, type } = await req.json();
    console.log("Received Data:", date, type); // Log incoming data

    let params: any[] = [date, type];
    let query = `
      SELECT 
        TO_CHAR(paid_date, 'YYYY-MM-DD') as "Paid date", 
        TO_CHAR(invoice_paid_from_month___year, 'YYYY-MM') as "Paid from month/year", 
        invoice_type, 
        paid_invoice_no, 
        visa_amount, 
        acount_transfer, 
        cash_amount, 
        totals 
      FROM "Nubras transactions"
      WHERE paid_date = $1 AND invoice_type = $2
    `;

    console.log("Constructed Query:", query); // Log constructed query
    console.log("Query Parameters:", params); // Log query params

    const pg = await client.connect();

    try {
      // Execute the main invoice query
      const result = await pg.query(query, params);

      // Query for total sales and quantity
      let salesQuery = `
      SELECT 
        SUM(CAST(visa_amount AS NUMERIC)) as "Total Visa Amount", 
        SUM(CAST(acount_transfer AS NUMERIC)) as "Total Bank Transfer", 
        SUM(CAST(cash_amount AS NUMERIC)) as "Total Cash Amount", 
        SUM(CAST(totals AS NUMERIC)) as "Total amount"
      FROM "Nubras transactions"
      WHERE invoice_type = $1 AND paid_date = $2
    `;
    
    
      let salesParams: any[] = [type, date];

      const salesResult = await pg.query(salesQuery, salesParams);

      // Query for monthly aggregates based on the invoice type
      let monthlyQuery = `
      SELECT 
        TO_CHAR(date_trunc('month', paid_date), 'YYYY-MM') as "Month",
        SUM(CAST(visa_amount AS NUMERIC)) as "Total Visa Amount", 
        SUM(CAST(acount_transfer AS NUMERIC)) as "Total Bank Transfer", 
        SUM(CAST(cash_amount AS NUMERIC)) as "Total Cash Amount", 
        SUM(CAST(totals AS NUMERIC)) as "Total amount"
      FROM "Nubras transactions"
      WHERE invoice_type = $1
    `;
      let monthlyParams: any[] = [type];

      if (date) {
        monthlyQuery += ` AND EXTRACT(YEAR FROM paid_date) = EXTRACT(YEAR FROM $${monthlyParams.length + 1}::DATE)`;
        monthlyQuery += ` AND EXTRACT(MONTH FROM paid_date) = EXTRACT(MONTH FROM $${monthlyParams.length + 1}::DATE)`;
        monthlyParams.push(date); // Push the date to the parameters array
      }

      monthlyQuery += ` GROUP BY date_trunc('month', paid_date)`;

      // Execute the monthly aggregate query
      const monthlyResult = await pg.query(monthlyQuery, monthlyParams);

      if (result.rows.length === 0) {
        return new Response("No data found", { status: 404 });
      }

      return new Response(
        JSON.stringify({
          invoices: result.rows,
          totals: salesResult.rows,
          monthTotals: monthlyResult.rows
        }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Query execution error:", error);
      return new Response("Internal Server Error", { status: 500 });
    } finally {
      pg.release();
    }
  } catch (error) {
    console.error("Error parsing request body:", error);
    return new Response("Invalid JSON", { status: 400 });
  }
}
