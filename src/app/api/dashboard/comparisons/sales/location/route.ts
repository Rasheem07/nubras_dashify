import client from "@/database";

export async function POST(): Promise<Response> {
  try {
    const pg = await client.connect();  // Connect to the database

    // Define the SQL query with CTEs
    const query = `
      WITH yearly_sales AS (
        SELECT 
          EXTRACT(YEAR FROM "SALE ORDER DATE") AS "YEAR", 
          "CUSTOMER LOCATION", 
          SUM("TOTAL AMOUNT") AS "TOTAL AMOUNT"
        FROM 
          nubras_database_final1
        GROUP BY 
          EXTRACT(YEAR FROM "SALE ORDER DATE"), "CUSTOMER LOCATION"
      ),
      yearly_average AS (
        SELECT 
          "YEAR", 
          AVG("TOTAL AMOUNT") AS "AVERAGE AMOUNT"
        FROM yearly_sales
        GROUP BY "YEAR"
      )
      SELECT 
        ys."YEAR", 
        ys."CUSTOMER LOCATION", 
        ys."TOTAL AMOUNT", 
        ya."AVERAGE AMOUNT"
      FROM 
        yearly_sales ys
      JOIN 
        yearly_average ya ON ys."YEAR" = ya."YEAR"
      ORDER BY 
        ys."YEAR", ys."CUSTOMER LOCATION";
    `;

    // Execute the query
    const result = await pg.query(query);

    // Release the client back to the pool
    pg.release();

    // Group the results into a structured format
    const groupedData = result.rows.reduce((acc, row) => {
      const year = row['YEAR'];
      if (year) {
        // Initialize the year object if it doesn't already exist
        if (!acc[year]) {
          acc[year] = [];
        }
    
        // Add the row data to the corresponding year group
        acc[year].push({
          location: row['CUSTOMER LOCATION'],
          total: row['TOTAL AMOUNT'],
          average: row['AVERAGE AMOUNT']
        });
      }
      return acc;
    }, {} as { [year: string]: { location: string, total: number, average: number }[] });
    
    // Return the grouped data
    return new Response(JSON.stringify(groupedData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
  } catch (error) {
    console.error('Error querying the database:', error);
    return new Response('Error fetching data', { status: 500 });
  }
}
