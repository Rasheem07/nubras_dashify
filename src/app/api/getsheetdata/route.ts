import { autoDetectAndConvertTypes } from "@/utils/autoDetectTypes";
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET(req: NextRequest) {
  // Get the query parameters from the request
  const url = new URL(req.url);
  const spreadsheetId = url.searchParams.get("spreadsheetId");
  const range = url.searchParams.get("range");

  if (!spreadsheetId) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  // Parse credentials from the environment variable
  const credentials = JSON.parse(process.env.GOOGLE_API_CRED || "{}");

  try {
    // Authenticate with Google API
    const auth = await google.auth.getClient({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    // Get the sheet name dynamically from the range or default to "Sheet1"
    const sheetName = range?.split("!")[0] || "Sheet1";
    const limitedRange = `${sheetName}!A1:Z3`; // Temporary range, we trim columns based on filled cells later

    // Fetch data from Google Sheets API
    const res = await google.sheets("v4").spreadsheets.values.get({
      auth,
      spreadsheetId: spreadsheetId,
      range: limitedRange,
      majorDimension: "ROWS", // Get rows instead of columns
    });

    const data = res.data.values;
    console.log('data', data)
    if (!data || data.length === 0) {
      return new Response(JSON.stringify([]), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Filter out empty columns dynamically by analyzing the first 3 rows
    const filledColumns = data[0].length; // Use header row length to determine filled columns
    const trimmedData = data.map((row) => row.slice(0, filledColumns)); // Trim each row to filled columns

    // Headers are in the first row
    const headers = trimmedData[0];

    // Auto detect types based on the first 3 rows
    const types = autoDetectAndConvertTypes(headers, trimmedData.slice(1));

    console.log(types)
    // Return the headers and detected types as a JSON response
    return new Response(
      JSON.stringify({ headers: headers, types: types || [] }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error(err);
    return new Response("Failed to fetch Google Sheet data", { status: 500 });
  }
}
