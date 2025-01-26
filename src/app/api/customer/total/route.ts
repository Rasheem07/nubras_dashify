import client from "@/database";

export async function GET() {
  const pg = await client.connect();

  const data = await pg.query(`SELECT 
    group_id, 
    phone_number,
    SUM(total_amount) AS "Sum of Total amount"
FROM 
    "Nubras updated database"
WHERE 
    total_amount IS NOT NULL
GROUP BY 
    group_id, phone_number
ORDER BY 
   "Sum of Total amount" DESC;`);

    return new Response(JSON.stringify(data.rows), {status: 200})
}
