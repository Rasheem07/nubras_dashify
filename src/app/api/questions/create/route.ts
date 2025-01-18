import client from "@/database";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { questionName, description, summaries, filters, groupBy } = await req.json();

  try {
    await client.query("BEGIN");

    // Insert question
    const questionResult = await client.query(
      "INSERT INTO questions (question_name, description) VALUES ($1, $2) RETURNING question_id",
      [questionName, description]
    );
    const questionId = questionResult.rows[0].question_id;

    // Insert summaries
    if (summaries && summaries.length > 0) {
      for (const summary of summaries) {
        if (!summary.type || !summary.column) {
          throw new Error("Both type and column are required for each summary");
        }

        await client.query(
          "INSERT INTO summaries (question_id, summary_type, column_name) VALUES ($1, $2, $3)",
          [questionId, summary.type, summary.column]
        );
      }
    }

    // Insert filters
    if (filters && filters.length > 0) {
      for (const filter of filters) {
        if (filter.between) {
          await client.query(
            "INSERT INTO filters (question_id, column_name, filter_type, start_date, end_date) VALUES ($1, $2, $3, $4, $5)",
            [
              questionId,
              filter.column,
              filter.type,
              filter.between.start,
              filter.between.end,
            ]
          );
        } else {
          await client.query(
            "INSERT INTO filters (question_id, column_name, filter_type, value) VALUES ($1, $2, $3, $4)",
            [
              questionId,
              filter.column,
              filter.type,
              filter.value || null,
            ]
          );
        }
      }
    }

    // Insert groupBy
    if (groupBy && groupBy.length > 0) {
      for (const group of groupBy) {
        await client.query(
          "INSERT INTO group_by (question_id, column_name, group_type, date_group) VALUES ($1, $2, $3, $4)",
          [questionId, group.column, group.type, group.dateGroup || null]
        );
      }
    }

    // Commit the transaction
    await client.query("COMMIT");

    return new Response(JSON.stringify({ message: "Data inserted successfully" }), { status: 200 });
  } catch (error) {
    // Rollback on error
    await client.query("ROLLBACK");
    console.error("Error during DB insertion:", error);
    return new Response(JSON.stringify({ error: "Error inserting data" }), { status: 500 });
  } 
}

