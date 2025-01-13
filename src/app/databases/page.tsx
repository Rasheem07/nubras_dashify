import { PrismaClient } from "@prisma/client";
import { Database, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

async function GetDatabases() {
  const prisma = new PrismaClient();
  const databases = await prisma.databases.findMany();
  return databases;
}

export default async function Page() {
  const databases = await GetDatabases(); // Directly await the result here

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-semibold flex items-center gap-x-2">
        <Database size={28} className="text-teal-600" />
        Databases
      </h1>
      <div className="grid grid-cols-2 grid-flow-row gap-4 mt-6 w-full">
        {databases.length > 0 ? (
          databases.map(
            (
              database: {
                id: string;
                name: string;
                description: string | null;
                headers: string[];
                types: string[];
              },
              i: number
            ) => (
              <Link
                key={i}
                href={`/databases/${database.name}`} // Adjust the link to point to the specific database dashboard
                className="border bg-white border-teal-300 cursor-pointer group hover:bg-teal-500  rounded-md shadow-lg hover:shadow-xl p-6 min-w-full text-start transition-all duration-300 ease-in-out transform hover:scale-105"
                aria-label="Go to database dashboard"
              >
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-2xl text-gray-700 font-semibold group-hover:text-zinc-50 transition-colors duration-300">
                      {database.name}
                    </h2>
                    <p className="text-base text-zinc-500 group-hover:text-zinc-200 transition-colors duration-300">
                      {database.description}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <button
                      className="bg-teal-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-teal-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                      aria-label="Go to dashboard"
                    >
                      Go to Dashboard
                    </button>
                    <span className="text-teal-600 group-hover:text-zinc-200 text-sm font-medium">
                      Click to explore
                    </span>
                  </div>
                </div>
              </Link>
            )
          )
        ) : (
          <p>No databases found.</p>
        )}
        <Link
          href={"/databases/add"}
          className="border bg-white border-teal-300 cursor-pointer group hover:bg-teal-500 rounded-md shadow-lg hover:shadow-xl p-6 min-w-full text-start"
          aria-label="Add a database"
        >
          <div className="flex items-center gap-x-3 mb-4">
            <div className="p-1.5 border bg-white rounded-md shadow-inner">
              <Image
                height={20}
                width={20}
                src="/icons/drive.png"
                alt="drive"
                className="h-5 w-5"
              />
            </div>
            <div className="p-1.5 border bg-white rounded-md shadow-inner">
              <Image
                height={20}
                width={20}
                src="/icons/bigquery.svg"
                alt="big query"
                className="h-5 w-5"
              />
            </div>
            <div className="p-1.5 border bg-white rounded-md shadow-inner">
              <Upload className="w-5 h-5 text-teal-600" />
            </div>
          </div>
          <h2 className="text-lg text-gray-700 font-medium group-hover:text-zinc-50">
            Add a Database
          </h2>
          <p className="text-sm text-zinc-500 group-hover:text-zinc-200">
            Connect your data source or upload.
          </p>
        </Link>
      </div>
    </div>
  );
}
