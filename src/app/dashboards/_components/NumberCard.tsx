/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import {
  Card as ShadcnCard,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"; // Adjust import as necessary
import { LucideIcon } from "lucide-react";
import { DollarSign, BarChart, CreditCard, Banknote } from "lucide-react"; // Example of different icons

type Data = {
  year: string;
  total_sum: string;
  tax_sum: string;
  visa_amount: string;
  bank_transfer_amount: string;
  cash_payment: string;
  advance_payment: string;
  excl_tax_sum: string;
  balance: string;
};

type CardProps = {
  currentData: Data;
  previousData?: Data;
  icon: LucideIcon; // Add icon prop
};

const percentageDifference = (current: string, previous: string) => {
  const currentValue = parseFloat(current);
  const previousValue = parseFloat(previous);

  if (!previousValue) return 0;

  return ((currentValue - previousValue) / previousValue) * 100;
};

const FinancialCard: React.FC<CardProps> = ({ currentData, previousData, icon: Icon }) => {
  // Updated field names for clarity
  const fields: { field: keyof Data; label: string }[] = [
    { field: "total_sum", label: "Total Sales" },
    { field: "tax_sum", label: "Total Tax Amount" },
    { field: "visa_amount", label: "Total Visa Amount" },
    { field: "bank_transfer_amount", label: "Total Bank Transfer Amount" },
    { field: "cash_payment", label: "Total Cash Payment" },
    { field: "advance_payment", label: "Total Advance Amount" },
    { field: "excl_tax_sum", label: "Total Amount Excluding Tax" },
    { field: "balance", label: "Total Balance Amount" },
  ];

  return (
    <div className="min-w-full mx-auto py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
      {fields.map(({ field, label }) => {
        const currentValue = currentData[field];
        if (currentValue === undefined) return null; // Skip if currentData[field] is undefined

        const prevYearValue = previousData ? previousData[field] : null;
        const diff = prevYearValue
          ? percentageDifference(currentValue, prevYearValue).toFixed(2)
          : "N/A";

        // Choose different icons based on the field
        let FieldIcon: LucideIcon;
        switch (field) {
          case "total_sum":
            FieldIcon = DollarSign;
            break;
          case "tax_sum":
            FieldIcon = BarChart;
            break;
          case "visa_amount":
            FieldIcon = CreditCard;
            break;
          case "bank_transfer_amount":
            FieldIcon = Banknote;
            break;
          default:
            FieldIcon = DollarSign; // Default icon
            break;
        }

        return (
          <ShadcnCard
            key={field}
            className="bg-white shadow-sm rounded-lg hover:shadow-md transition-shadow"
          >
            <CardHeader className="flex flex-col items-center py-4">
              <FieldIcon className="h-8 w-8 text-teal-600" />
              <div className="text-center mt-2">
                <CardTitle className="text-lg font-medium text-gray-800">{label}</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {prevYearValue ? `${previousData?.year} Comparison` : "No Data for Previous Year"}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-2xl font-semibold text-teal-800">
              <p>${parseFloat(currentValue).toLocaleString()}</p>
              {prevYearValue && (
                <p className="text-sm text-gray-500 mt-2">
                  Previous Year: ${parseFloat(prevYearValue).toLocaleString()}
                </p>
              )}
              {prevYearValue ? (
                <p
                  className={`mt-2 text-sm ${
                    Number(diff) > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {Number(diff) > 0 ? `+${diff}%` : `${diff}%`} compared to{" "}
                  {previousData!.year}
                </p>
              ) : (
                <p className="mt-2 text-sm text-gray-500">Data not available for previous year</p>
              )}
            </CardContent>
          </ShadcnCard>
        );
      })}
    </div>
  );
};

export default FinancialCard;
