import client from "@/database";

export async function GET() {
  const pg = await client.connect();

  try {
    // Query all rows from the collections table
    const result = await pg.query("SELECT * FROM collections");

    // Return the collections data as JSON
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return new Response("Failed to fetch collections", { status: 500 });
  } finally {
    pg.release(); // Release the database connection back to the pool
  }
}
