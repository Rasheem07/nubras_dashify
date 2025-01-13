/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { convertValueBasedOnType } from "@/utils/convertValue";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Function to convert date string to YYYY-MM-DD format
function convertToDateFormat(date: Date | string): string | null {
  const formatted = new Date(date).toLocaleDateString();
  const newDate = formatted.split("/");
  return `${newDate[2]}-${newDate[0]}-${newDate[1]}`;
}

export async function POST(req: NextRequest) {
  console.log("Request received"); // First log to track request entry

  // Parsing the request body to JSON
  let body;
  try {
    body = await req.json();
  } catch (error) {
    console.error("Error parsing request body:", error);
    return new Response("Invalid JSON body", { status: 400 });
  }

  const { spreadsheetId, range, headers, types, name, description } = body;

  if (!spreadsheetId || !range || !headers || !types) {
    return new Response("Missing required fields in request body", {
      status: 400,
    });
  }

  console.log("Parsed request body successfully:", {
    spreadsheetId,
    range,
    headers,
    types,
    name,
    description,
  });

  const cleanedHeaders = headers.filter(
    (header: string) => header !== undefined
  );

  await prisma.databases.create({
    data: {
      name: name,
      description: description,
      types: types,
      headers: cleanedHeaders,
    },
  });
  console.log("Database entry created successfully"); // Log after database entry creation

  console.log("headers:", cleanedHeaders);
  console.log("types:", types);

  if (!spreadsheetId || !range) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  const credentials = JSON.parse(process.env.GOOGLE_API_CRED || "{}");

  try {
    // Authenticate with Google API
    const auth = await google.auth.getClient({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    // Get data from Google Sheets API
    const res = await google.sheets("v4").spreadsheets.values.get({
      auth,
      spreadsheetId,
      range,
    });

    const data = res.data.values;
    if (!data) {
      return new Response(JSON.stringify([]), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!data || !Array.isArray(data)) {
      return new Response("Invalid or empty data from Google Sheets", {
        status: 400,
      });
    }

    console.log("Data fetched successfully from Google Sheets");

    // Map data to a single array of objects, each object is a row with header-value pairs
    const mappedData = data.slice(1).map((row) => {
      return row.reduce((obj, value, i) => {
        const columnType = types[i];
        obj[cleanedHeaders[i]] = convertValueBasedOnType(value, columnType);
        return obj;
      }, {} as Record<string, any>);
    });

    // Dynamically create a table using raw SQL
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS ${name} (
        id SERIAL PRIMARY KEY,
        ${cleanedHeaders
          .map((header: string, idx: number) => {
            const type = types[idx];
            switch (type) {
              case "string":
                return `"${header}" VARCHAR(255)`;
              case "number":
                return `"${header}" INT`;
              case "date":
                return `"${header}" DATE`;
              default:
                return `"${header}" VARCHAR(255)`;
            }
          })
          .join(", ")}
      );
    `;

    // Execute the raw SQL to create the table
    await prisma.$executeRawUnsafe(createTableSQL);

    console.log("inserting....");
    // Insert the fetched data into the dynamically created table
    const insertPromises = mappedData.map((dataRow) => {
      console.log("Inserting data row:", dataRow); // Log to see what's being inserted

      const columns = Object.keys(dataRow)
        .map((col) => `"${col}"`)
        .join(", ");

      const values = Object.values(dataRow)
        .map((value) => {
          if (typeof value === "string") {
            return `'${value.replace(/'/g, "''")}'`; // Escape single quotes
          } else if (value instanceof Date) {
            return `'${convertToDateFormat(value)}'`; // Format date to YYYY-MM-DD
          } else {
            return value != null ? value : "NULL";
          }
        })
        .join(", ");

      const insertSQL = `
        INSERT INTO ${name} (${columns}) 
        VALUES (${values});
      `;

      return prisma.$executeRawUnsafe(insertSQL);
    });

    await Promise.all(insertPromises);

    console.log("Data inserted successfully");

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Error:", err.stack);
    return new Response("Failed to fetch Google Sheet data", { status: 500 });
  }
}
