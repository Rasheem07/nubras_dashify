import client from "@/database";

// pages/api/getSalesData.js
export async function GET() {
  try {
    // Updated query with the capitalized aliases
    const query = `
      SELECT
        SUM(product_quantity) AS "Total Product Quantity",
        AVG(product_quantity) AS "Average Product Quantity",
        SUM(visa_payment) AS "Total Visa Payment",
        AVG(visa_payment) AS "Average Visa Payment",
        SUM(bank_transfer_payment) AS "Total Bank Transfer Payment",
        AVG(bank_transfer_payment) AS "Average Bank Transfer Payment",
        SUM(cash_payment) AS "Total Cash Payment",
        AVG(cash_payment) AS "Average Cash Payment",
        SUM(advance_amount_payment) AS "Total Advance Amount Payment",
        AVG(advance_amount_payment) AS "Average Advance Amount Payment",
        SUM(total_amount_1) AS "Total Amount",
        AVG(total_amount_1) AS "Average Amount",
        SUM(tax_amount) AS "Total Tax Amount",
        AVG(tax_amount) AS "Average Tax Amount",
        SUM(tax__) AS "Total Tax",
        AVG(tax__) AS "Average Tax",
        SUM(amount_excluding_tax) AS "Total Amount Excluding Tax",
        AVG(amount_excluding_tax) AS "Average Amount Excluding Tax",
        SUM(balance_amount_1) AS "Total Balance Amount",
        AVG(balance_amount_1) AS "Average Balance Amount"
      FROM nubras
        WHERE EXTRACT(MONTH FROM sale_order_date) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM sale_order_date) = EXTRACT(YEAR FROM CURRENT_DATE);
    `;

    const { rows } = await client.query(query);

    return new Response(JSON.stringify(rows[0]), { status: 200 });
  } catch (error) {
    console.error("Database query error", error);
    return new Response("An error occurred", { status: 500 });
  }
}
