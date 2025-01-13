'use server'

import client from "..";

// Server action to fetch column names dynamically from a table
export async function getColumns(tableName: string) {
  const pg = await client.connect();
  const result = await pg.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = $1
  `, [tableName]);

  await pg.release();
  return result.rows.map((column: { column_name: string }) => column.column_name);
}

// Server action to fetch data from a specified table
export async function getData(tableName: string) {
  const pg = await client.connect();
  const result = await pg.query(`SELECT * FROM ${tableName}`);
  await pg.release();
  return result.rows; // Return only the rows
}
