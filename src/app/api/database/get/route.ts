/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/data/route.ts
import client from '@/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const name = url.searchParams.get('name');
  const page = parseInt(url.searchParams.get('page') || '1');
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
  const offset = (page - 1) * pageSize;

  const pg = await client.connect();

  try {
    // Query the total row count
    const totalCountResult = await pg.query(
      `SELECT COUNT(*) FROM ${name} WHERE "SALE ORDER DATE" BETWEEN $1 AND $2`,
      ['2024-12-01', '2024-12-31']
    );
    const totalCount = parseInt(totalCountResult.rows[0].count);

    // Query the data for the current page
    const result = await pg.query(
      `SELECT * FROM ${name} WHERE "SALE ORDER DATE" BETWEEN $1 AND $2 ORDER BY id LIMIT $3 OFFSET $4`,
      ['2024-12-01', '2024-12-31', pageSize, offset]
    );

    return NextResponse.json({
      data: result.rows,
      totalCount, // Send the total row count to frontend
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch data', message: error.message }, { status: 500 });
  } finally {
    await pg.release();
  }
}
