"use client";
import { Menu, Settings } from "lucide-react";
import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSidebar } from "@/contexts/SiderbarContext";
// import Image from "next/image";  
import { usePathname } from "next/navigation";

export default function Header() {
  const { toggleSidebar , isSidebarOpen} = useSidebar();
  const path = usePathname()

  return (
    <div className={`w-full ${!path.startsWith("/dashboards") && 'border-b'} ${isSidebarOpen && 'border-b'} bg-white shadow-inner border-gray-300 h-14 flex items-center px-3 md:px-5 `}>
      <div className="flex items-center justify-between w-full">
        <Button
          variant={"ghost"}
          className="cursor-pointer"
          onClick={toggleSidebar}
        >
          <Menu className="scale-150" />
        </Button>

        <div className="flex items-center gap-x-6">
      

          <Input
            className="md:w-[300px]"
            placeholder="Search for dashboard, charts etc..."
          />
          <Button size={"sm"} className=" bg-teal-800 hover:bg-zinc-teal/90">
            <Settings className="text-white h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
