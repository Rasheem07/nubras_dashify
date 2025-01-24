/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import client from "@/database";
import { NextRequest } from "next/server";


export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { category, branch, date } = await req.json();
    console.log("Received Data:", category, branch, date); // Log incoming data

    let params: any[] = [category];
    let query = `
      SELECT 
        TO_CHAR(sale_order_date, 'YYYY-MM-DD') as "Date", 
        product_list as "Items", 
        sales_person as "Salesman", 
        product_quantity as "Qty", 
        product_price_pc as "Price/Pc", 
        visa_payment as "Visa Amount", 
        bank__payment as "Bank Transfer Amount", 
        cash_payment as "Cash Amount", 
        total_amount as "Total Amount", 
        balance_amount as "Balance",
        order_payment_status as "Order Payment Status"
      FROM nubras
      WHERE product_categories = $1
    `;

    if (date && date !== "") {
      query += ` AND sale_order_date::date = $${params.length + 1}`;
      params.push(date);
    }

    if (branch && branch !== "") {
      query += ` AND nubras_branch = $${params.length + 1}`;
      params.push(branch);
    }

    console.log("Constructed Query:", query); // Log constructed query
    console.log("Query Parameters:", params); // Log query params

    const pg = await client.connect();

    try {
      const result = await pg.query(query, params);

      let productsQuery = `
        SELECT 
          product_list, 
          SUM(CAST(total_amount AS NUMERIC)) as "Total Sales", 
          SUM(CAST(product_quantity AS NUMERIC)) as "Total Quantity"
        FROM nubras 
        WHERE product_categories = $1
      `;
      let productsParams: any[] = [category];

      if (date && date !== "") {
        productsQuery += ` AND sale_order_date::date = $${productsParams.length + 1}`;
        productsParams.push(date);
      }

      if (branch && branch !== "") {
        productsQuery += ` AND nubras_branch = $${productsParams.length + 1}`;
        productsParams.push(branch);
      }

      productsQuery += ` GROUP BY product_list`;

      // Execute the product query
      const productsResult = await pg.query(productsQuery, productsParams);

      let totalsQuery = `
        SELECT 
          SUM(product_quantity) as "Total Qty",
          SUM(visa_payment) as "Total Visa Amount",
          SUM(bank__payment) as "Total Bank Transfer Amount",
          SUM(cash_payment) as "Total Cash Amount",
          SUM(total_amount) as "Total Amount",
          SUM(balance_amount) as "Total Balance"
        FROM nubras
        WHERE product_categories = $1
      `;
      let totalsParams: any[] = [category];

      if (date && date !== "") {
        totalsQuery += ` AND sale_order_date::date = $${totalsParams.length + 1}`;
        totalsParams.push(date);
      }

      if (branch && branch !== "") {
        totalsQuery += ` AND nubras_branch = $${totalsParams.length + 1}`;
        totalsParams.push(branch);
      }

      // Execute the totals query
      const totalsResult = await pg.query(totalsQuery, totalsParams);
      let MonthlyProducttotalsParams: any[] = [category];

      let MonthlyProducttotalsQuery = `
      SELECT 
        TO_CHAR(date_trunc('month', sale_order_date), 'YYYY-MM') as "Month", -- Truncate to first day of the month and format
        product_list,
        SUM(product_quantity) as "Total Qty",
        SUM(visa_payment) as "Total Visa Amount",
        SUM(bank__payment) as "Total Bank Transfer Amount",
        SUM(cash_payment) as "Total Cash Amount",
        SUM(total_amount) as "Total Amount",
        SUM(balance_amount) as "Total Balance"
      FROM nubras
      WHERE product_categories = $1
    `;
    
    
    if (date && date !== "") {
      MonthlyProducttotalsQuery += ` AND EXTRACT(YEAR FROM sale_order_date) = EXTRACT(YEAR FROM $${MonthlyProducttotalsParams.length + 1}::DATE)`;
      MonthlyProducttotalsQuery += ` AND EXTRACT(MONTH FROM sale_order_date) = EXTRACT(MONTH FROM $${MonthlyProducttotalsParams.length + 1}::DATE)`;
      MonthlyProducttotalsParams.push(date); // Push the date to the parameters array
    }
    
    if (branch && branch !== "") {
      MonthlyProducttotalsQuery += ` AND nubras_branch = $${MonthlyProducttotalsParams.length + 1}`;
      MonthlyProducttotalsParams.push(branch);
    }
    
    MonthlyProducttotalsQuery += ` GROUP BY date_trunc('month', sale_order_date), product_list`;
    

    
    const productsMonthlyTotals = await pg.query(MonthlyProducttotalsQuery, MonthlyProducttotalsParams);

      let MonthlytotalsQuery = `
      SELECT 
        TO_CHAR(date_trunc('month', sale_order_date), 'YYYY-MM') as "Month",  -- Truncate to first day of the month and format
        SUM(product_quantity) as "Total Qty",
        SUM(visa_payment) as "Total Visa Amount",
        SUM(bank__payment) as "Total Bank Transfer Amount",
        SUM(cash_payment) as "Total Cash Amount",
        SUM(total_amount) as "Total Amount",
        SUM(balance_amount) as "Total Balance"
      FROM nubras
      WHERE product_categories = $1
    `;
    
    let MonthlytotalsParams: any[] = [category];
    
    if (date && date !== "") {
      MonthlytotalsQuery += ` AND EXTRACT(YEAR FROM sale_order_date) = EXTRACT(YEAR FROM $${MonthlytotalsParams.length + 1}::DATE)`;
      MonthlytotalsQuery += ` AND EXTRACT(MONTH FROM sale_order_date) = EXTRACT(MONTH FROM $${MonthlytotalsParams.length + 1}::DATE)`;
      MonthlytotalsParams.push(date); // Push the date to the parameters array
    }
    
    if (branch && branch !== "") {
      MonthlytotalsQuery += ` AND nubras_branch = $${MonthlytotalsParams.length + 1}`;
      MonthlytotalsParams.push(branch);
    }
    
    MonthlytotalsQuery += `
      GROUP BY date_trunc('month', sale_order_date)  
    `;

      // Execute the totals query
      const MonthlytotalsResult = await pg.query(MonthlytotalsQuery, MonthlytotalsParams);

    

      if (result.rows.length === 0) {
        return new Response("No data found", { status: 404 });
      }

      const processedRows = result.rows.map(row => {
        // Process the "Price/Pc" field
        const price = row["Price/Pc"];
        
        // Remove commas and check if it's convertible to a number
        const cleanedPrice = price.replace(/,/g, ""); // Remove commas
        const numericPrice = Number(cleanedPrice);
      
        // Check if the price is a valid number
        const priceValue = !isNaN(numericPrice) ? numericPrice : cleanedPrice.slice(6); // Convert if valid number, otherwise slice
      
        return {
          ...row,
          "Price/Pc": priceValue, // Assign the processed value
        };
      });

      return new Response(
        JSON.stringify({
          data: processedRows,
          products: productsResult.rows,
          totals: totalsResult.rows,
          monthTotals: MonthlytotalsResult.rows,
          ProductsMonthly: productsMonthlyTotals.rows
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
