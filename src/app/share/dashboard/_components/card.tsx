// components/SalesCard.js
import React from "react";

const SalesCard = ({
  title,
  title2,
  name,
  total,
  average,
}: {
  title: string;
  title2?: string;
  name: string;
  total: number;
  average: number;
}) => {
  return (
    <div className=" w-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-300">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-black">{name}</h2>
        <div className="mt-6">
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-xl font-bold text-black mt-2">{Number(total).toFixed(2)}</p>
        </div>
        {title2 && (
          <div className="mt-6">
            <p className="text-gray-600 text-sm">{title2}</p>
            <p className="text-xl font-bold text-black mt-2">{Number(average).toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesCard;
