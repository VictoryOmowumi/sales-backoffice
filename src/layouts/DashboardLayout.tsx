import { SidebarDesktop, SidebarMobile } from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import RouteTracker from "@/components/routing/RouteTracker";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex bg-background">
      <SidebarMobile />
      <SidebarDesktop />
      <div className="flex-1 flex flex-col   m-1.5 rounded-2xl border border-white dark:border-neutral-800 shadow-lg !bg-[#F9f9f9] dark:!bg-[#111111]">
        <RouteTracker />
        <Topbar />
        <main className="flex-1 p-6 overflow-x-clip">
          <ScrollArea className="h-full">
          <Outlet />
        </ScrollArea>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
