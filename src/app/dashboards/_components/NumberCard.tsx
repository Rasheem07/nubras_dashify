// components/ui/Card.tsx
import React from "react";
import {
  Card as ShadcnCard,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface CardProps {
  title: string;
  description: string;
  value: string | number;
  icon: LucideIcon;
}

const NumberCard: React.FC<CardProps> = ({
  title,
  description,
  value,
  icon: Icon,
}) => {
  return (
    <ShadcnCard
      className={` bg-white shadow-sm rounded-lg hover:shadow-md transition-shadow`}
    >
      <CardHeader className="flex flex-col items-center">
        <Icon className="h-8 w-8" />
        <div className="text-center">
          <CardTitle className="text-lg font-medium text-gray-800">
            {title}
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex justify-center text-2xl font-semibold text-gray-900">
        {value}
      </CardContent>
    </ShadcnCard>
  );
};

export default NumberCard;
