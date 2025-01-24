import client from "@/database";

export async function GET() {
  const pg = await client.connect();

  const products = await pg.query(
    `SELECT 
       product_list, 
       SUM(product_quantity) AS "Total products sold", 
       ROUND(SUM(total_amount)::numeric, 2) AS "Total sales amount", 
       ROUND(AVG(total_amount)::numeric, 2) AS "Average sales amount" 
     FROM nubras 
     GROUP BY product_list`
  );

  pg.release();

  return new Response(JSON.stringify(products.rows), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
