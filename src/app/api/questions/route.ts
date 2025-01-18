import client from "@/database";
import { NextResponse } from "next/server";

export async function GET() {
    const pg = await client.connect();
    try {
      // Query to retrieve all questions with related summaries, group by, and filters
      const query = `
        SELECT 
            q.question_id,
            q.question_name,
            q.description,
            q.created_at,
            q.updated_at,
            -- Summaries
            json_agg(
                jsonb_build_object(
                    'summary_type', s.summary_type,
                    'column_name', s.column_name,
                    'alias_name', s.alias_name
                )
            ) AS summaries,
            -- GroupBy
            json_agg(
                jsonb_build_object(
                    'group_type', g.group_type,
                    'column_name', g.column_name,
                    'date_group', g.date_group
                )
            ) AS group_by,
            -- Filters
            json_agg(
                jsonb_build_object(
                    'column_name', f.column_name,
                    'filter_type', f.filter_type,
                    'value', f.value,
                    'start_date', f.start_date,
                    'end_date', f.end_date
                )
            ) AS filters
        FROM 
            questions q
        LEFT JOIN summaries s ON s.question_id = q.question_id
        LEFT JOIN group_by g ON g.question_id = q.question_id
        LEFT JOIN filters f ON f.question_id = q.question_id
        GROUP BY 
            q.question_id;
      `;
  
      const result = await pg.query(query);
      pg.release();
  
      // If no questions found
      if (result.rows.length === 0) {
        return NextResponse.json({ message: "No questions found." }, { status: 404 });
      }
  
      // Return the data
      return NextResponse.json(result.rows);
    } catch (error) {
      console.error("Error during database query:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }