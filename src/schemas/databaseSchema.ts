import z from 'zod';

const DatabaseForm = z.object({
    sheetId: z.string().min(1, {message: "Sheet Id required!"}),
    sheetRange: z.string().min(1, {message: "sheet range is required!"}),
    headerMappings: z.array(z.object({column: z.string(), name: z.string()})).optional(),
    dataabaseSchema: z.array(z.object({name: z.string(), type: z.string()})).optional(),
    DatabaseName: z.string().min(1, {message: "Database name is required!"}),
    DatabaseDescription: z.string().optional()
})

export default DatabaseForm;