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
    { field: "advance_payment", label: "Total Advance Amount" },
    { field: "excl_tax_sum", label: "Total Amount Excluding Tax" },
    { field: "balance", label: "Total Balance Amount" },
  ];

  return (
    <div className="min-w-full mx-auto py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            FieldIcon = DollarSign; // Total Sales
            break;
          case "tax_sum":
            FieldIcon = BarChart; // Total Tax Amount
            break;
          case "visa_amount":
            FieldIcon = CreditCard; // Total Visa Amount
            break;
          case "advance_payment":
            FieldIcon = CreditCard; // Total Advance Amount (CreditCard can be used as an icon)
            break;
          case "excl_tax_sum":
            FieldIcon = BarChart; // Total Amount Excluding Tax (BarChart for financial analysis)
            break;
          case "balance":
            FieldIcon = Banknote; // Total Balance Amount (Banknote for balance)
            break;
          default:
            FieldIcon = DollarSign; // Default icon (DollarSign as fallback)
            break;
        }
        

        return (
          <ShadcnCard
            key={field}
            className="bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow ease-in-out duration-300 transform hover:scale-100"
          >
            <CardHeader className="flex flex-col items-center py-2">
              <FieldIcon className="h-8 w-8 text-teal-600 mb-2" />
              <div className="text-center mt-2">
                <CardTitle className="text-lg font-medium text-gray-800">{label}</CardTitle>
                <CardDescription className="text-xs text-gray-500">
                  {prevYearValue ? `${previousData?.year} Comparison` : "No Data for Previous Year"}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-xl font-semibold text-teal-800 space-y-1">
              <p>AED {parseFloat(currentValue).toLocaleString()}</p>
              {prevYearValue && (
                <p className="text-sm text-gray-500 mt-1">
                  Previous Year: AED {parseFloat(prevYearValue).toLocaleString()}
                </p>
              )}
              {prevYearValue ? (
                <p
                  className={`mt-1 text-sm font-medium ${
                    Number(diff) > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {Number(diff) > 0 ? `+${diff}%` : `${diff}%`} compared to{" "}
                  {previousData!.year}
                </p>
              ) : (
                <p className="mt-1 text-sm text-gray-500">Data not available for previous year</p>
              )}
            </CardContent>
          </ShadcnCard>
        );
      })}
    </div>
  );
};

export default FinancialCard;
