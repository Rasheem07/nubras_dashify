import client from "@/database";

export async function GET() {
  const pg = await client.connect();

  const data = await pg.query(`SELECT 
    group_id, 
    phone_number,
    count(*) AS "Total visits"
FROM 
    "Nubras updated database"
GROUP BY 
    group_id, phone_number
ORDER BY 
    "Total visits" DESC;`);

    return new Response(JSON.stringify(data.rows), {status: 200})
}
