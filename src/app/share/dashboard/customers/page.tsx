/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import SalesTable from "@/app/dashboards/_components/salesTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";

export default function Customers() {
  const [customersCount, setCustomersCount] = useState<any[]>([]); // Make sure it's an array
  const [currentPage, setCurrentPage] = useState(1); // Current page for customersCount
  const [itemsPerPage] = useState(100); // Rows per page
  const [year, setYear] = useState("");
  const [groupId, setGroupId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [minTotal, setMinTotal] = useState("");
  const [groupIdData, setgroupIdData] = useState<any[]>([]);
  const [customer_name, setcustomer_name] = useState('')
  useEffect(() => {
    if (groupId === "" && phoneNumber === "") {
      (async () => {
        try {
          // Fetch data with filters
          const response = await fetch("/api/customer/count", {
            method: "POST",
            body: JSON.stringify({
              year,
              group_id: groupId,
              phone_number: phoneNumber,
              min_total: minTotal,
              customer_name
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          const json = await response.json();

          // Check if the response is an array
          if (Array.isArray(json)) {
            setCustomersCount(json);
          } else {
            console.error("Expected an array but received:", json);
            setCustomersCount([]); // Set to empty array if the response is not an array
          }
        } catch (error) {
          console.error("Error fetching customer data:", error);
          setCustomersCount([]); // Set to empty array in case of an error
        }
      })();
    } else {
      (async () => {
        try {
          // Fetch data with filters
          const response = await fetch("/api/customer/groupid", {
            method: "POST",
            body: JSON.stringify({
              year,
              group_id: groupId,
              phone_number: phoneNumber,
              min_total: minTotal,
              customer_name
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          const json = await response.json();

          // Check if the response is an array
          if (Array.isArray(json)) {
            setgroupIdData(json);
          } else {
            console.error("Expected an array but received:", json);
            setgroupIdData([]); // Set to empty array if the response is not an array
          }
        } catch (error) {
          console.error("Error fetching customer data:", error);
          setgroupIdData([]); // Set to empty array in case of an error
        }
      })();
    }
  }, [year, groupId, phoneNumber, minTotal,customer_name]); // Fetch data when filters change

  // Pagination logic for customersCount
  const indexOfLastCustomerItem = currentPage * itemsPerPage;
  const indexOfFirstCustomerItem = indexOfLastCustomerItem - itemsPerPage;
  const currentCustomerItems = customersCount.slice(
    indexOfFirstCustomerItem,
    indexOfLastCustomerItem
  );

  // Pagination logic for groupIdData
  const indexOfLastGroupItem = currentPage * itemsPerPage;
  const indexOfFirstGroupItem = indexOfLastGroupItem - itemsPerPage;
  const currentGroupItems = groupIdData.slice(
    indexOfFirstGroupItem,
    indexOfLastGroupItem
  );

  // Handle page change for customersCount or groupIdData
  const paginateCustomers = (pageNumber: number) => setCurrentPage(pageNumber);

  // Calculate total pages for customersCount
  const totalPagesCustomers = Math.ceil(customersCount.length / itemsPerPage);

  // Calculate total pages for groupIdData
  const totalPagesGroupData = Math.ceil(groupIdData.length / itemsPerPage);

  return (
    <div className="p-6 w-full">
      {/* Main Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Customer Group Visit Overview
        </h1>
        <p className="text-lg text-gray-600">
          Filter and view detailed information on customer visits by group and
          total spend.
        </p>
      </div>

      {/* Filters Section */}
      <div className="flex space-x-4 my-4">
        <Input
          value={year}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setYear(e.target.value)
          }
          placeholder="Year"
          className="w-40"
        />
        <Input
          value={groupId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setGroupId(e.target.value)
          }
          placeholder="Group ID"
          className="w-40"
        />
        <Input
          value={phoneNumber}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPhoneNumber(e.target.value)
          }
          placeholder="Phone Number"
          className="w-40"
        />
        <Input
          value={customer_name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setcustomer_name(e.target.value)
          }
          placeholder="Customer name"
          className="w-40"
        />
        <Input
          value={minTotal}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setMinTotal(e.target.value)
          }
          placeholder="Min Total"
          className="w-40"
        />

        <Button
          onClick={() => {
            setYear("");
            setGroupId("");
            setPhoneNumber("");
            setMinTotal("");
          }}
          className="px-6 bg-red-500 hover:bg-red-600 text-white"
        >
          Reset Filters
        </Button>
      </div>

      {/* Pagination Controls for Customers */}
      <div className="flex justify-between items-center my-4">
        <Button
          className="px-4 py-2  rounded-l"
          onClick={() =>
            paginateCustomers(currentPage > 1 ? currentPage - 1 : 1)
          }
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <div className="text-sm text-gray-600">
          Page {currentPage} of{" "}
          {groupId || phoneNumber ? totalPagesGroupData : totalPagesCustomers}
        </div>
        <Button
          className="px-4 py-2 rounded-r"
          onClick={() =>
            paginateCustomers(
              currentPage <
                (groupId || phoneNumber
                  ? totalPagesGroupData
                  : totalPagesCustomers)
                ? currentPage + 1
                : groupId || phoneNumber
                ? totalPagesGroupData
                : totalPagesCustomers
            )
          }
          disabled={
            currentPage ===
            (groupId || phoneNumber ? totalPagesGroupData : totalPagesCustomers)
          }
        >
          Next
        </Button>
      </div>

      {groupId || phoneNumber ? (
       <Card>
       <CardContent>
         {/* Display sum of total_amount and length of currentGroupItems */}
         <div className="my-4">
           <p><strong>Total Visits: </strong>{groupIdData.length}</p>
           <p><strong>Total Amount: </strong>
             {groupIdData.reduce((acc, item) => acc + parseFloat(item["Total amount"] || "0"), 0).toFixed(2)}
           </p>
         </div>
     
         {/* Render SalesTable */}
         <SalesTable
           name="Total visits for customer groups by invoices"
           data={currentGroupItems}
         />
       </CardContent>
     </Card>
     
      ) : (
        <SalesTable
          name="Total visits for customer groups"
          data={currentCustomerItems}
        />
      )}
    </div>
  );
}
