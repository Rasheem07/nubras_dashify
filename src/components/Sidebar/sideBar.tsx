// Sidebar.tsx
"use client";
import React from "react";
import { useSidebar } from "@/contexts/SiderbarContext";
import Logo from "../Icons/Logo";
import SideBarNavLink from "./sideBarNavLink";
import { Bell, Book, Database, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Sidebar: React.FC = () => {
  const { isSidebarOpen } = useSidebar();
  const path = usePathname();
  const isSharePath = path.startsWith("/share");
  return (
    <div
      style={{
        minWidth: isSidebarOpen ? "275px" : "0",
        width: isSidebarOpen ? '275px' : 0,
        overflow: "hidden",
        transitionTimingFunction: isSidebarOpen ? "ease-in" : "ease-out",
      }}
      className={cn(" bg-white border-r w-full transition-all fixed md:relative left-0 z-10 max-h-[calc(100vh-56px)]", {isSidebarOpen: 'min-w-[275px]', 'hidden': isSharePath})}
    >
      {isSidebarOpen && (
        <div className="flex flex-col  h-full flex-1">
          <div className="p-6 space-y-6 ">
            <Logo />

            <div className="flex flex-col gap-y-2">
              <SideBarNavLink Icon={Database} text="Databases" isActive={path.startsWith("/databases")} />
              <SideBarNavLink Icon={LayoutDashboard} text="Dashboards" isActive={path.startsWith("/dashboards")}/>
              <SideBarNavLink Icon={Book} text="Collections" isActive={path == "/collections"} />
              <SideBarNavLink Icon={Bell} text="Notifications" isActive={path == "/notifications"} />
            </div>
            {/* Add your sidebar content here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
