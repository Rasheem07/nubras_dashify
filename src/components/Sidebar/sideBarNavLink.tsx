import { LucideIcon } from "lucide-react";
import React from "react";
import Link from 'next/link';


export default function SideBarNavLink({
  Icon,
  text,
  isActive = false
}: {
  Icon: LucideIcon;
  text: string;
  isActive?: boolean
}) {
  return (
    <Link href={text === 'Home' ? '/' : `/${text.toLowerCase()}`} className={`flex items-center gap-x-3 py-2 px-2 rounded-lg group cursor-pointer ${isActive ? 'bg-teal-500'  : 'hover:bg-zinc-100'}`}>
      <div className={`p-1 ${!isActive ? 'bg-zinc-100 border': 'text-zinc-50'} rounded-md `}>
        <Icon className="h-4 w-4 " />
      </div>
      <span className={`text-sm font-medium ${isActive ? 'text-zinc-100' : 'text-gray-800'}`}>
        {text}
      </span>
    </Link>
  );
}
