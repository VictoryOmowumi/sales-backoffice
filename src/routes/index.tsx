// src/routes/index.tsx
import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

import Home from "@/pages/Home";
import Executive from "@/pages/ExecutiveDashboard";
import DirectOverview from "@/pages/DirectSales/Overview";
import DirectUOM from "@/pages/DirectSales/UOMComparison";
import DirectRetention from "@/pages/DirectSales/Retention";
import PaymentOverview from "@/pages/Payments/Overview"
import PaymentDetail from "@/pages/Payments/PaymentDetail"
import CustomersOverview from "@/pages/Customers/Overview";
import CustomerDirectory from "@/pages/Customers/Directory";
import CustomerDetail from "@/pages/Customers/CustomerDetail";
import Orders from "@/pages/Orders";
import OrdersAnalytics from "@/pages/Orders/Analytics";
import OrderDetail from "@/pages/Orders/OrderDetail";
import RoutesOverview from "@/pages/Routes/Overview";
import RouteDetail from "@/pages/Routes/RouteDetail";
import RoutesAnalytics from "@/pages/Routes/Analytics";
import Targets from "@/pages/Targets";
import CreateTargets from "@/pages/Targets/Create";
import Login from "@/pages/Login";
import Campaigns from "@/pages/Campaigns";
import Promotions from "@/pages/Promotions";
import PerformanceTab from "@/pages/DirectSales/tabs/PerformanceTabs";
import Resources from "@/pages/Resources";
import Help from "@/pages/Help";
export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    element: <ProtectedRoute />, // any authenticated user
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "executive", element: <Executive /> },

          {
            path: "/direct/overview",
            element: <DirectOverview />,
            children: [
              { path: "performance", element: <PerformanceTab /> },
              { path: "brand", element: <div className="p-6 text-sm text-muted-foreground">Brand overview (coming soon)</div> },
              { path: "location", element: <div className="p-6 text-sm text-muted-foreground">Location overview (coming soon)</div> },
              { path: "group", element: <div className="p-6 text-sm text-muted-foreground">Group overview (coming soon)</div> },
              { index: true, element: <PerformanceTab /> },
            ],
          },
          { path: "direct/uom", element: <DirectUOM /> },
          { path: "direct/retention", element: <DirectRetention /> },

          { path: "payments/overview", element: <PaymentOverview /> },
          { path: "payments/:paymentId", element: <PaymentDetail /> },
          
          { path: "customers/overview", element: <CustomersOverview /> },
          { path: "customers/directory", element: <CustomerDirectory /> },
          { path: "customers/:customerId", element: <CustomerDetail /> },
          { path: "orders/overview", element: <Orders /> },
          { path: "orders/analytics", element: <OrdersAnalytics /> },
          { path: "orders/:orderId", element: <OrderDetail /> },
          { path: "routes/overview", element: <RoutesOverview /> },
          { path: "routes/analytics", element: <RoutesAnalytics /> },
          { path: "routes/:routeId", element: <RouteDetail /> },
          { path: "targets/overview", element: <Targets /> },
          { path: "targets/create", element: <CreateTargets /> },
          { path: "targets/drafts", element: <div className="p-6 text-sm text-muted-foreground">Drafts page (coming soon)</div> },
          { path: "targets/awaiting-approval", element: <div className="p-6 text-sm text-muted-foreground">Awaiting Approval page (coming soon)</div> },
          { path: "targets/history", element: <div className="p-6 text-sm text-muted-foreground">History page (coming soon)</div> },

          {path: "campaigns", element: <Campaigns />},
          {path: "promotions", element: <Promotions />},
          {path: "resources", element: <Resources />},
          {path: "help", element: <Help />}

        ],
      },
    ],
  },
]);
