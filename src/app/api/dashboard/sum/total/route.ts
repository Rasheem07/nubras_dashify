import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // First query to get total sums
    const totalSumsResult = await prisma.$queryRaw<{
      total_sum: bigint | null;
      tax_sum: bigint | null;
      excl_tax_sum: bigint | null;
    }[]>`
      SELECT
        SUM("TOTAL AMOUNT") AS total_sum,
        SUM("TAX AMOUNT") AS tax_sum,
        SUM("AMOUNT EXCLUDING TAX") AS excl_tax_sum
      FROM Nubras_database;
    `;

    // Second query to get the monthly totals and calculate the average
    const monthlyAvgResult = await prisma.$queryRaw<{
      avg_monthly_sales: bigint | null;
    }[]>`
      SELECT
        AVG(monthly_sales) AS avg_monthly_sales
      FROM (
        SELECT
          SUM("TOTAL AMOUNT") AS monthly_sales
        FROM Nubras_database
        GROUP BY DATE_TRUNC('month', "Sale Date")
      ) AS monthly_totals;
    `;

    // Extract and safely handle BigInt values for total sums
    const totalAmountSum = totalSumsResult[0]?.total_sum ? totalSumsResult[0].total_sum.toString() : '0';
    const taxAmountSum = totalSumsResult[0]?.tax_sum ? totalSumsResult[0].tax_sum.toString() : '0';
    const amountExcludingTaxSum = totalSumsResult[0]?.excl_tax_sum ? totalSumsResult[0].excl_tax_sum.toString() : '0';

    // Safely handle BigInt value for monthly average
    const avgMonthlySales = monthlyAvgResult[0]?.avg_monthly_sales ? parseFloat(monthlyAvgResult[0].avg_monthly_sales.toString()) : 0;

    // Return the response
    return new Response(
      JSON.stringify({
        totalAmountSum,
        taxAmountSum,
        amountExcludingTaxSum,
        avgMonthlySales,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Error calculating aggregates:", error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
