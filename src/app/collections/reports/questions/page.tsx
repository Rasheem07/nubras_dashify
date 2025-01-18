/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState } from "react";
import QuestionDialog from "@/components/QuestionDialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Questions = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("/api/questions");
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div className="p-6 space-y-6 w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Questions</h1>
          <p className="text-sm font-sans text-gray-600">All the questions in the daily sales collection</p>
        </div>
        <QuestionDialog />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-500"></div>
        </div>
      ) : (
        // Questions Card Listing
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {questions.length === 0 ? (
            <p>No questions available.</p>
          ) : (
            questions.map((question) => (
              <Link   
                href={`/collections/reports/questions/${question.question_id}`}
                key={question.question_id}
                className="flex flex-col border bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 w-full"
              >
                <div className="p-4 space-y-4">
                  {/* Question Name */}
                  <div>

                  <h3 className="text-xl capitalize font-medium text-teal-600">{question.question_name}</h3>
                  <p className="text-sm text-gray-500">{question.description}</p>
                  </div>

                 <div className="flex items-center gap-x-4 justify-around">

                  {/* Display summaries */}
                  <div className="space-y-1">
                    <h4 className="text-base font-semibold text-teal-500">Summaries</h4>
                    {question.summaries && question.summaries.length > 0 ? (
                      <ul className="space-y-1 text-sm text-gray-700">
                        {question.summaries.map((summary: any, index: number) => (
                          <li key={index}>
                            {summary.summary_type} ({summary.column_name})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-300">No summaries available</p>
                    )}
                  </div>

                  {/* Display group by */}
                  <div className="space-y-1">
                    <h4 className="text-base font-semibold text-teal-500">Group By</h4>
                    {question.group_by && question.group_by.length > 0 ? (
                      <ul className="space-y-1 text-sm text-gray-700">
                        {question.group_by.map((group: any, index: number) => (
                          <li key={index}>
                            {group.group_type} ({group.column_name})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-300">No group by configurations</p>
                    )}
                  </div>

                  {/* Display filters */}
                  <div className="space-y-1">
                    <h4 className="text-base font-semibold text-teal-500">Filters</h4>
                    {question.filters && question.filters.length > 0 ? (
                      <ul className="space-y-1 text-sm text-gray-700">
                        {question.filters.map((filter: any, index: number) => (
                          <li key={index}>
                            {filter.filter_type} {filter.value || "N/A"}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-300">No filters available</p>
                    )}
                  </div>
                      </div>
                </div>

                {/* Card Footer */}
                <div className="bg-gray-50 p-3 border-t flex justify-between items-center">
                  <span className="text-xs text-gray-500">{question.created_at}</span>
                  <Button
                  className="bg-teal-500 hover:bg-teal-600"
                    onClick={() => alert(`Details of ${question.question_name}`)}
                  >
                    Visualize
                  </Button>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Questions;
