// components/SalesCard.js
import React from "react";

const SalesCard = ({
  name,
  title,
  total,
  title2,
  average,
  title3,
  value3,
}: {
  name: string;
  title: string;
  total: number;
  title2?: string;
  average?: number;
  title3?: string;
  value3?: number;
}) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-300">
      <div className="p-5">
        {/* Card Heading */}
        <h2 className="text-2xl font-semibold text-teal-700">{name}</h2>

        {/* First Title and Value */}
        <div className="mt-3">
          <p className="text-gray-700 text-sm">{title}</p>
          <p className="text-xl font-bold text-black mt-1">{Number(total).toFixed(2)}</p>
        </div>

        {/* Second Title and Value (Optional) */}
        {title2 && average !== undefined && (
          <div className="mt-3">
            <p className="text-gray-700 text-sm">{title2}</p>
            <p className="text-xl font-bold text-black mt-1">{Number(average).toFixed(2)}</p>
          </div>
        )}

        {/* Third Title and Value (Optional) */}
        {title3 && value3 !== undefined && (
          <div className="mt-3">
            <p className="text-gray-700 text-sm">{title3}</p>
            <p className="text-xl font-bold text-black mt-1">{Number(value3).toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesCard;
