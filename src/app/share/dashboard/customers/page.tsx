'use client'
import SalesTable from '@/app/dashboards/_components/salesTable';
import React, { useEffect, useState } from 'react';

export default function Customers() {
   const [customersCount, setCustomersCount] = useState([]);
   const [totalData, setTotalData] = useState([]);
   const [currentPage, setCurrentPage] = useState(1); // Current page for customersCount
   const [totalPage, setTotalPage] = useState(1); // Current page for totalData
   const [itemsPerPage] = useState(100); // Rows per page
   
   useEffect(() => {
     (async () => {
        const response = await fetch('/api/customer/count');
        const json = await response.json();
        setCustomersCount(json);
     })();
     (async () => {
        const response = await fetch('/api/customer/total');
        const json = await response.json();
        setTotalData(json);
     })();
   }, []); // Empty dependency array to fetch only once when component mounts

   // Logic for Pagination for customersCount
   const indexOfLastCustomerItem = currentPage * itemsPerPage;
   const indexOfFirstCustomerItem = indexOfLastCustomerItem - itemsPerPage;
   const currentCustomerItems = customersCount.slice(indexOfFirstCustomerItem, indexOfLastCustomerItem);

   // Logic for Pagination for totalData
   const indexOfLastTotalItem = totalPage * itemsPerPage;
   const indexOfFirstTotalItem = indexOfLastTotalItem - itemsPerPage;
   const currentTotalItems = totalData.slice(indexOfFirstTotalItem, indexOfLastTotalItem);

   // Handle page change for customersCount
   const paginateCustomers = (pageNumber: number) => setCurrentPage(pageNumber);

   // Handle page change for totalData
   const paginateTotal = (pageNumber: number) => setTotalPage(pageNumber);

   // Calculate total pages for customersCount
   const totalPagesCustomers = Math.ceil(customersCount.length / itemsPerPage);

   // Calculate total pages for totalData
   const totalPagesTotal = Math.ceil(totalData.length / itemsPerPage);

   return (
      <div className='p-6 w-full'>
         <div>
            {/* Pagination Controls for Customers */}
            <div className="flex justify-between my-4">
               <button 
                  className="px-4 py-2 bg-gray-300 rounded-l"
                  onClick={() => paginateCustomers(currentPage > 1 ? currentPage - 1 : 1)}
                  disabled={currentPage === 1}
               >
                  Previous
               </button>
               
               <button 
                  className="px-4 py-2 bg-gray-300 rounded-r"
                  onClick={() => paginateCustomers(currentPage < totalPagesCustomers ? currentPage + 1 : totalPagesCustomers)}
                  disabled={currentPage === totalPagesCustomers}
               >
                  Next
               </button>
            </div>

            {/* Displaying Customers Table */}
            <SalesTable name='total visits for customer groups ' data={currentCustomerItems} />
         </div>
         
         <div className="mt-8">
            {/* Pagination Controls for Total Data */}
            <div className="flex justify-between my-4">
               <button 
                  className="px-4 py-2 bg-gray-300 rounded-l"
                  onClick={() => paginateTotal(totalPage > 1 ? totalPage - 1 : 1)}
                  disabled={totalPage === 1}
               >
                  Previous
               </button>

               <button 
                  className="px-4 py-2 bg-gray-300 rounded-r"
                  onClick={() => paginateTotal(totalPage < totalPagesTotal ? totalPage + 1 : totalPagesTotal)}
                  disabled={totalPage === totalPagesTotal}
               >
                  Next
               </button>
            </div>

            {/* Displaying Total Data Table */}
            <SalesTable name='total amounts for customer groups ' data={currentTotalItems} />
         </div>
      </div>
   );
}
