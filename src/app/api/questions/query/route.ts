import client from "@/database";
import { NextRequest } from "next/server";

interface Summary {
  type: string;
  column?: string;
}

interface GroupBy {
  column: string;
  type: string;
  dateGroup?: string;
}

interface Filter {
  column: string;
  type:
    | "between"
    | "greater than"
    | "less than"
    | "equals to"
    | "less than or equal to"
    | "greater than or equal to"
    | "not equals to";
  value?: string;
  between?: { start: string; end: string };
}

export async function POST(req: NextRequest) {
  const { questionId } = await req.json(); // Retrieve questionId from request body

  if (!questionId) {
    return new Response(JSON.stringify({ error: "Question ID is required" }), { status: 400 });
  }

  const pg = await client.connect();

  try {
    // Fetch the configurations for the given questionId
    const questionConfigQuery = `
      SELECT q.question_name, q.description, s.summary_type, s.column_name as summary_column, s.alias_name,
             g.column_name as group_by_column, g.group_type, g.date_group,
             f.column_name as filter_column, f.filter_type, f.value, f.start_date, f.end_date, f.start_value, f.end_value
      FROM questions q
      LEFT JOIN summaries s ON q.question_id = s.question_id
      LEFT JOIN group_by g ON q.question_id = g.question_id
      LEFT JOIN filters f ON q.question_id = f.question_id
      WHERE q.question_id = $1
    `;

    const result = await pg.query(questionConfigQuery, [questionId]);

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Question not found" }), { status: 404 });
    }

    // Retrieve summaries, groupBy, and filters from the result
    const summaries: Summary[] = result.rows
      .filter(row => row.summary_type)
      .map(row => ({
        type: row.summary_type,
        column: row.summary_column,
      }));

    const groupBy: GroupBy[] = result.rows
      .filter(row => row.group_by_column)
      .map(row => ({
        column: row.group_by_column,
        type: row.group_type,
        dateGroup: row.date_group,
      }));

    const filters: Filter[] = result.rows
      .filter(row => row.filter_column)
      .map(row => ({
        column: row.filter_column,
        type: row.filter_type,
        value: row.value,
        between: row.start_date && row.end_date
          ? { start: row.start_date, end: row.end_date }
          : undefined,
      }));

    // Build summary part of the query (this part is mandatory)
    const summaryQuery = summaries
      .map((summary: Summary) => {
        if (summary.type !== "count") {
          return `${summary.type}(${summary.column}) AS "${summary.type} of ${summary.column}"`;
        }
        return "count(*)";
      })
      .join(", ");

    // Build GROUP BY part of the query (only if groupBy is provided)
    let groupByQuery = "";
    if (groupBy && groupBy.length > 0) {
      groupByQuery = groupBy
        .map(group => {
          if (group.type === "date" && group.dateGroup) {
            switch (group.dateGroup) {
              case "DAY":
                return `TO_CHAR(${group.column}, 'YYYY-MM-DD')`;
              case "month":
                return `TO_CHAR(${group.column}, 'YYYY-MM')`;
              case "week":
                return `TO_CHAR(${group.column}, 'IYYY-IW')`;
              case "quarter":
                return `TO_CHAR(${group.column}, 'YYYY') || '-Q' || EXTRACT(QUARTER FROM ${group.column})`;
              case "half":
                return `TO_CHAR(${group.column}, 'YYYY') || '-H' || CASE WHEN EXTRACT(MONTH FROM ${group.column}) <= 6 THEN 1 ELSE 2 END`;
              case "year":
                return `TO_CHAR(${group.column}, 'YYYY')`;
              default:
                return group.column;
            }
          }
          return group.column;
        })
        .join(", ");
    }

    // Build WHERE clause for filters (only if filters are provided)
    const filterConditions = filters
      ? filters
          .map((filter: Filter) => {
            if (filter.type === "between" && filter.between) {
              return `${filter.column} BETWEEN '${filter.between.start}' AND '${filter.between.end}'`;
            }
            switch (filter.type) {
              case "greater than":
                return `${filter.column} > '${filter.value}'`;
              case "less than":
                return `${filter.column} < '${filter.value}'`;
              case "equals to":
                return `${filter.column} = '${filter.value}'`;
              case "less than or equal to":
                return `${filter.column} <= '${filter.value}'`;
              case "greater than or equal to":
                return `${filter.column} >= '${filter.value}'`;
              case "not equals to":
                return `${filter.column} != '${filter.value}'`;
              default:
                return "";
            }
          })
          .filter(condition => condition)
          .join(" AND ")
      : "";

    // Build the full query
    let query = `SELECT ${summaryQuery}`; // summaryQuery is always present
    if (groupByQuery) {
      query += `, ${groupByQuery}`;
    }
    query += ` FROM nubras_sales_data`;

    if (filterConditions) {
      query += ` WHERE ${filterConditions}`;
    }

    if (groupByQuery) {
      query += ` GROUP BY ${groupByQuery} ORDER BY ${groupByQuery}`;
    }

    // Execute the query
    const queryResult = await pg.query(query);

    // Format result to replace "to_char" with "date"
    const formattedResult = queryResult.rows.map(row => ({
      ...row,
      sales_order_date: row.to_char, // Rename "to_char" to "date"
      to_char: undefined, // Remove original "to_char" key
    }));

    // Return the results along with groupBy
    return new Response(JSON.stringify({ data: formattedResult, groupBy }), { status: 200 });
  } catch (error) {
    console.error("Error during database query:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  } finally {
    pg.release();
  }
}
