import client from "@/database";

// pages/api/getSalesData.js
export async function GET() {
  try {
    // Updated query with the capitalized aliases
    const query = `
      SELECT
        SUM(advance_payment) AS "Total Advance Amount Payment",
        AVG(advance_payment) AS "Average Advance Amount Payment",
        SUM(total_amount) AS "Total Amount",
        AVG(total_amount) AS "Average Amount",
        SUM(balance_amount) AS "Total Balance Amount",
        AVG(balance_amount) AS "Average Balance Amount"
      FROM "nubras customer";
    `;

    const { rows } = await client.query(query);

    return new Response(JSON.stringify(rows[0]), { status: 200 });
  } catch (error) {
    console.error("Database query error", error);
    return new Response("An error occurred", { status: 500 });
  }
}
