import client from "@/database";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { title, description } = await req.json();

  const pg = await client.connect();

  // Correcting the CREATE TABLE query by adding the missing closing parenthesis
  await pg.query(
    `CREATE TABLE IF NOT EXISTS collections (
      ID SERIAL PRIMARY KEY, 
      title VARCHAR(30) NOT NULL, 
      description VARCHAR(30)
    );`
  );

  const collection = await pg.query(
    "SELECT title FROM collections WHERE title = $1 LIMIT 1",
    [title]
  );

  if (collection.rows.length > 0) {
    return new Response(
      "Collection already exists, please choose some other title",
      { status: 404 }
    );
  }

  await pg.query(
    "INSERT INTO collections (title, description) VALUES($1, $2)",
    [title, description]
  );

  return new Response(JSON.stringify({ success: true }), { status: 201 });
}
