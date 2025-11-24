import {
    LayoutDashboard, BarChartBig, PieChart,  Users, ShoppingCart,
    Target, Blocks, CircleHelp, BadgeCent,
    Megaphone, Route, UserCheck
  } from "lucide-react";
  import type { ComponentType } from "react";
import type { UserRole } from "@/context/AuthContext";
  
  export type NavIcon = ComponentType<{ className?: string, strokeWidth?: number }>;
  
  export type NavItem = {
    label: string;
    to?: string;               // leaf link
    icon?: NavIcon;
    roles?: UserRole[];        // omit = visible to all
    badge?: number | "dot";
    children?: NavItem[];      // group
  };
  
  export const nav: NavItem[] = [
    { label: "Home", to: "/", icon: LayoutDashboard },
    { label: "Executive", to: "/executive", roles: ["executive","gtm"], icon: BarChartBig },
  
    {
      label: "Direct Sales", icon: PieChart, children: [
        { label: "Overview", to: "/direct/overview" },
        { label: "UOM vs UOM", to: "/direct/uom" },
        { label: "Retention", to: "/direct/retention" },
      ],
    },
    {
      label: "Payments", icon: BadgeCent, children: [
        { label: "Overview", to: "/payments/overview" },
       
      ],
    },
  
    {
      label: "Customers",
      icon: Users,
      children: [
        { label: "Overview", to: "/customers/overview" },
        { label: "Customer Directory", to: "/customers/directory" },
      ],
    },
    { label: "Orders", icon: ShoppingCart, children: [
      { label: "Overview", to: "/orders/overview" },
      { label: "Analytics", to: "/orders/analytics" },
    ] },
    {
      label: "Sales Team",
      icon: UserCheck,
      children: [
        { label: "Overview", to: "/sales-team/overview" },
        { label: "Directory", to: "/sales-team/directory" },
        { label: "Onboard", to: "/sales-team/onboard", roles: ["executive", "gtm"] },
        { label: "Mappings", to: "/sales-team/mappings", roles: ["executive", "gtm"] },
      ],
    },
    {
      label: "Routes",
      icon: Route,
      children: [
        { label: "Overview", to: "/routes/overview" },
        { label: "Analytics", to: "/routes/analytics", roles: ["gtm", "executive"] },
      ],
    },
    {
      label: "Targets",
      icon: Target,
      children: [
        { label: "Overview", to: "/targets/overview" },
        { label: "Create Targets", to: "/targets/create" },
        { label: "Drafts", to: "/targets/drafts" },
        { label: "Awaiting Approval", to: "/targets/awaiting-approval" },
        { label: "History", to: "/targets/history" },
      ],
    },
    {
      label: "Marketing",
      icon: Megaphone,
      children: [
        { label: "Campaigns", to: "/campaigns" },
        { label: "Promotions", to: "/promotions" },
      ],
    },
   
    // examples / admin area
    { label: "Resources", to: "/resources", icon: Blocks, roles: ["executive","gtm"] },
    { label: "Help", to: "/help", icon: CircleHelp },
  ];
  