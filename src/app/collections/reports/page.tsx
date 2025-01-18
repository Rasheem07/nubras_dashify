import { FileQuestion, Text } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Collection() {
  return (
    <div className="p-6 space-y-6 w-full max-w-5xl mx-auto">
      <div className="flex items-center w-full justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Browse your collections
          </h1>
          <p className="text-base font-sans text-zinc-600">
            Create, edit and remove reports in the collections
          </p>
        </div>
        </div>
      <div className="flex items-center gap-x-6 w-full ">
        <div className="flex flex-col gap-3 w-full rounded-lg shadow-lg p-6 border border-zinc-300 bg-white">
          <Text />
          <h1 className="text-2xl font-semibold text-gray-800">Reports</h1>
          <p className="text-base font-sans text-zinc-600">
            All the reports in the daily sales collection
          </p>
        </div>
        <Link href={'/collections/reports/questions'} className="flex flex-col gap-3 w-full rounded-lg shadow-lg p-6 border border-zinc-300 bg-white">
          <FileQuestion />
          <h1 className="text-2xl font-semibold text-gray-800">Questions</h1>
          <p className="text-base font-sans text-zinc-600">
            All the questions in the daily sales collection
          </p>
        </Link>
      </div>
    </div>
  );
}
