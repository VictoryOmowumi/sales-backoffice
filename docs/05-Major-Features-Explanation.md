# Major Features Explanation

## Overview

This document provides detailed explanations of the major features in the Sales Backoffice application. Each feature is described with its purpose, functionality, user workflows, and technical implementation details.

## Table of Contents

1. [Home Dashboard](#1-home-dashboard)
2. [Executive Dashboard](#2-executive-dashboard)
3. [Direct Sales Management](#3-direct-sales-management)
4. [Payments Management](#4-payments-management)
5. [Customer Management](#5-customer-management)
6. [Order Management](#6-order-management)
7. [Route Management](#7-route-management)
8. [Target Management](#8-target-management)
9. [Marketing Management](#9-marketing-management)
10. [Resources Management](#10-resources-management)

---

## 1. Home Dashboard

### Purpose
The Home Dashboard serves as the central command center for all users, providing quick access to key information, pending tasks, and frequently used features.

### Key Features

#### 1.1 Personalized Greeting
- **Functionality**: Displays a personalized greeting based on time of day (Good Morning, Good Afternoon, Good Evening)
- **User Experience**: Welcomes the user by name and shows current period information
- **Technical Implementation**: Client-side time-based greeting logic

#### 1.2 Daily Goals & Metrics
- **Functionality**: Displays daily performance metrics
  - Revenue goal vs actual
  - Visit targets
  - Pending approvals count
- **User Experience**: Quick visibility into daily performance
- **Data Source**: Aggregated from orders, visits, and approval workflows

#### 1.3 Upcoming Events
- **Functionality**: Shows scheduled events for the day
  - Customer visits
  - Meetings
  - Deadlines
- **User Experience**: Calendar-like view of upcoming activities
- **Technical Implementation**: Fetches scheduled events from routes and calendar

#### 1.4 Pending Approvals
- **Functionality**: Lists items requiring user approval
  - Orders pending approval
  - Target batches awaiting approval
  - Credit limit requests
- **User Experience**: Quick access to approval workflows
- **Workflow**: Click to navigate to approval detail page

#### 1.5 Quick Actions
- **Functionality**: Shortcut buttons for common tasks
  - Orders
  - Customers
  - Campaigns
  - Promotions
  - Pivot Grid
  - Executive PDF Export
- **User Experience**: One-click access to frequently used features

#### 1.6 Command Palette
- **Functionality**: Keyboard-driven navigation (⌘K / Ctrl+K)
  - Search across all features
  - Quick navigation to any page
  - Access to favorites and recent items
- **User Experience**: Power-user feature for fast navigation
- **Technical Implementation**: Client-side search with keyboard shortcuts

### User Workflows

#### For Sales Representatives
1. Log in → View daily goals
2. Check pending approvals
3. Review upcoming visits
4. Quick access to create orders

#### For Managers (RSM/TDM)
1. Log in → View team performance
2. Review pending approvals
3. Check team visit schedules
4. Access target management

#### For Executives
1. Log in → View high-level KPIs
2. Review strategic approvals
3. Access executive dashboard
4. Export reports

### Technical Details
- **Component**: `src/pages/Home/index.tsx`
- **State Management**: Zustand stores for favorites, recents, filters
- **Data Fetching**: TanStack Query for server state
- **Real-time Updates**: Polling or WebSocket for live data (future)

---

## 2. Executive Dashboard

### Purpose
The Executive Dashboard provides high-level strategic insights and cross-functional analytics for executive-level decision making.

### Key Features

#### 2.1 High-Level KPIs
- **Functionality**: Displays key performance indicators
  - Total revenue
  - Growth rate
  - Market share
  - Customer acquisition
  - Order fulfillment rate
- **User Experience**: Visual cards with trend indicators
- **Data Aggregation**: Cross-regional and cross-channel aggregation

#### 2.2 Revenue Trends
- **Functionality**: Time-series visualization of revenue
  - Actual vs previous period
  - Actual vs last year
  - Forecast trends
- **User Experience**: Interactive line charts
- **Technical Implementation**: ECharts for visualization

#### 2.3 Market Share Analysis
- **Functionality**: Market share trends
  - Share by brand
  - Share by category
  - Competitive analysis
- **User Experience**: Stacked area charts and pie charts
- **Data Source**: Sales data aggregated by brand/category

#### 2.4 Cross-Regional Performance
- **Functionality**: Regional performance comparison
  - Revenue by region
  - Growth by region
  - Market penetration by region
- **User Experience**: Comparative bar charts and maps
- **Filtering**: Date range, channel, category filters

#### 2.5 Strategic Insights
- **Functionality**: AI-powered insights and recommendations
  - Anomaly detection
  - Trend predictions
  - Actionable recommendations
- **User Experience**: Card-based insights with drill-down capability
- **Technical Implementation**: Backend analytics engine (future)

### User Workflows

#### For Executives
1. Log in → Navigate to Executive Dashboard
2. Review high-level KPIs
3. Analyze revenue trends
4. Compare regional performance
5. Review strategic insights
6. Export executive reports

### Technical Details
- **Component**: `src/pages/ExecutiveDashboard/index.tsx`
- **Data Visualization**: ECharts, Recharts
- **Filtering**: Global filters for date range, region, channel
- **Export**: PDF export functionality

---

## 3. Direct Sales Management

### Purpose
Direct Sales Management provides comprehensive tools for managing and analyzing direct sales operations, including performance tracking, UOM comparison, and customer retention analysis.

### Key Features

#### 3.1 Sales Overview
- **Functionality**: Comprehensive sales performance dashboard
  - Total revenue and cases
  - Revenue by brand
  - Revenue by category
  - Revenue by region
  - Revenue by channel
- **User Experience**: Interactive charts and tables
- **Filtering**: Date range, region, channel filters

#### 3.2 Performance Tabs
- **Functionality**: Multi-dimensional analysis
  - **Performance Tab**: Overall performance metrics
  - **Brand Tab**: Brand-wise analysis (coming soon)
  - **Location Tab**: Location-wise analysis (coming soon)
  - **Group Tab**: Group-wise analysis (coming soon)
- **User Experience**: Tabbed interface for different views
- **Technical Implementation**: Nested routing for tab navigation

#### 3.3 UOM Comparison
- **Purpose**: Compare sales performance across different units of measure
- **Functionality**:
  - Cases vs Units comparison
  - Conversion rate analysis
  - Brand-wise UOM breakdown
  - Category-wise UOM breakdown
- **User Experience**: Side-by-side comparison charts
- **Business Value**: Helps understand sales patterns across different measurement units

#### 3.4 Retention Analysis
- **Purpose**: Analyze customer retention and churn
- **Functionality**:
  - Retention rate calculation
  - New customer acquisition
  - Lost customer analysis
  - Period-wise retention trends
- **User Experience**: Trend charts and retention metrics
- **Business Value**: Identifies customer retention patterns and opportunities

### User Workflows

#### For Sales Representatives
1. Navigate to Direct Sales → Overview
2. Review personal sales performance
3. Compare UOM metrics
4. Check customer retention

#### For Managers
1. Navigate to Direct Sales → Overview
2. Review team performance
3. Analyze brand/category performance
4. Review retention trends
5. Identify improvement opportunities

### Technical Details
- **Components**: 
  - `src/pages/DirectSales/Overview.tsx`
  - `src/pages/DirectSales/UOMComparison.tsx`
  - `src/pages/DirectSales/Retention.tsx`
- **Data Visualization**: ECharts for charts
- **State Management**: Direct filters store (Zustand)
- **Data Generation**: Mock data generator for development

---

## 4. Payments Management

### Purpose
Payments Management provides comprehensive tools for tracking, analyzing, and managing payment transactions across all channels and regions.

### Key Features

#### 4.1 Payments Overview
- **Functionality**: High-level payment metrics
  - Total revenue collected
  - Successful vs failed transactions
  - Transaction count
  - Bank-wise revenue breakdown
- **User Experience**: KPI cards and visualizations
- **Filtering**: Date range, region filters

#### 4.2 Bank Revenue Breakdown
- **Functionality**: Revenue breakdown by payment provider
  - Direct bank transfers (ABVA, ZBVA, GBVA, GTB)
  - Payment gateways (Paystack, Flutterwave, Interswitch)
  - Visual representation with bank logos
- **User Experience**: Pie charts and bar charts
- **Business Value**: Identifies preferred payment methods

#### 4.3 Payment Details
- **Functionality**: Individual payment transaction details
  - Transaction reference
  - Payment status
  - Customer information
  - Order linkage
  - Invoice information
  - Processing status
  - NAVISION integration status
- **User Experience**: Detailed view with all transaction information
- **Workflow**: Click on payment to view details

#### 4.4 Payment Analytics
- **Functionality**: Advanced payment analytics
  - Regional collection analysis
  - Daily collection trends
  - Collection by bank analysis
  - Success rate trends
- **User Experience**: Time-series charts and comparative analysis
- **Business Value**: Identifies payment patterns and optimization opportunities

### User Workflows

#### For Finance Team
1. Navigate to Payments → Overview
2. Review daily collection
3. Check failed transactions
4. Review bank-wise breakdown
5. Investigate payment details

#### For Managers
1. Navigate to Payments → Overview
2. Review regional collection
3. Analyze payment trends
4. Identify payment issues

### Technical Details
- **Components**:
  - `src/pages/Payments/Overview.tsx`
  - `src/pages/Payments/PaymentDetail.tsx`
- **Domain Models**: `src/domain/payments.ts`
- **Data Visualization**: ECharts for charts
- **Payment Types**: Direct (Type 1) and Virtual Account (Type 2)

---

## 5. Customer Management

### Purpose
Customer Management provides comprehensive tools for managing customer relationships, tracking customer performance, and analyzing customer health.

### Key Features

#### 5.1 Customer Overview
- **Functionality**: High-level customer metrics
  - Total active customers
  - Customer by status (Active, OnHold, Inactive)
  - Revenue by customer segment
  - Customer health metrics
- **User Experience**: KPI cards and visualizations
- **Filtering**: Region, channel, status filters

#### 5.2 Customer Directory
- **Functionality**: Comprehensive customer listing
  - Search and filter capabilities
  - Customer status tracking
  - Contact information
  - Quick actions (view, edit, create order)
- **User Experience**: Data grid with sorting and filtering
- **Technical Implementation**: MUI Data Grid for advanced features

#### 5.3 Customer Detail
- **Purpose**: Comprehensive customer profile and analytics
- **Key Sections**:

##### 5.3.1 Customer Information
- Basic customer details
- Contact information
- Address and location
- Payment terms
- Price tier
- Assigned sales rep and managers

##### 5.3.2 Credit Management
- Credit limit and exposure
- Credit aging (0-30, 31-60, 61-90, 90+ days)
- DSO (Days Sales Outstanding)
- Credit holds and reasons
- Credit history

##### 5.3.3 Performance KPIs
- Last 90 days revenue
- Year-to-date revenue
- Orders count
- Average order value
- Fill rate percentage
- On-time delivery percentage
- Price compliance percentage
- Return rate percentage
- Visit compliance percentage

##### 5.3.4 Order History
- Recent orders
- Order status tracking
- Order value trends
- Fill rate trends

##### 5.3.5 Payment History
- Payment transactions
- Payment methods
- Outstanding balances
- Payment trends

##### 5.3.6 Visit History
- Planned visits
- Completed visits
- Visit compliance
- Visit notes

##### 5.3.7 Return Claims
- Return history
- Return reasons
- Credit notes
- Return trends

##### 5.3.8 Activity Timeline
- All customer activities
- Order events
- Payment events
- Visit events
- Notes and documents

### User Workflows

#### For Sales Representatives
1. Navigate to Customers → Directory
2. Search for customer
3. View customer detail
4. Check credit status
5. Create order
6. Schedule visit

#### For Managers
1. Navigate to Customers → Overview
2. Review customer health metrics
3. Identify at-risk customers
4. Review credit exposure
5. Analyze customer performance

### Technical Details
- **Components**:
  - `src/pages/Customers/Overview.tsx`
  - `src/pages/Customers/Directory.tsx`
  - `src/pages/Customers/CustomerDetail.tsx`
- **Domain Models**: `src/domain/customer-detail.ts`
- **Data Visualization**: ECharts for trend charts
- **State Management**: Customer filters store

---

## 6. Order Management

### Purpose
Order Management provides comprehensive tools for creating, tracking, and managing sales orders throughout their lifecycle.

### Key Features

#### 6.1 Order Overview
- **Functionality**: Comprehensive order listing
  - Search and filter capabilities
  - Order status tracking
  - Fulfillment status tracking
  - Payment status tracking
  - Quick actions (view, edit, approve, reject)
- **User Experience**: Data grid with advanced filtering
- **Filtering**: Date range, region, channel, status, customer, sales rep

#### 6.2 Order Detail
- **Purpose**: Comprehensive order information and tracking
- **Key Sections**:

##### 6.2.1 Order Information
- Order number and date
- Customer information
- Sales rep information
- Region and channel
- Order status
- Fulfillment status
- Payment status

##### 6.2.2 Order Lines
- SKU details
- Quantity (cases/units)
- Unit price
- Line value
- Discounts
- Fulfillment status

##### 6.2.3 Financial Summary
- Subtotal
- Discounts
- Tax
- Shipping
- Total amount

##### 6.2.4 Order Events Timeline
- Order submission
- Approval/rejection
- Confirmation
- Packing
- Shipping
- Delivery
- Payment received
- Returns

##### 6.2.5 Order Actions
- Approve order (managers)
- Reject order (managers)
- Cancel order
- Update order (draft status)
- Create invoice
- Track shipment

#### 6.3 Order Analytics
- **Functionality**: Advanced order analytics
  - Total orders and value
  - Average order value
  - Fulfillment rate
  - On-time delivery rate
  - Return rate
  - Status distribution
  - Fulfillment status distribution
  - Payment status distribution
- **User Experience**: Charts and metrics
- **Business Value**: Identifies order processing efficiency

### Order Lifecycle

1. **Draft**: Order being created by sales rep
2. **Pending Approval**: Order submitted, awaiting manager approval
3. **Confirmed**: Order approved and confirmed
4. **Packed**: Order items packed for shipment
5. **Shipped**: Order in transit
6. **Delivered**: Order delivered to customer
7. **Invoiced**: Invoice generated
8. **Paid**: Payment received
9. **Returned**: Order returned by customer (if applicable)
10. **Cancelled**: Order cancelled (if applicable)

### User Workflows

#### For Sales Representatives
1. Navigate to Orders → Overview
2. Create new order
3. Add order lines (SKUs, quantities)
4. Submit order for approval
5. Track order status
6. View order details

#### For Managers
1. Navigate to Orders → Overview
2. Review pending approvals
3. Approve or reject orders
4. Monitor order fulfillment
5. Review order analytics

### Technical Details
- **Components**:
  - `src/pages/Orders/index.tsx`
  - `src/pages/Orders/OrderDetail.tsx`
  - `src/pages/Orders/Analytics.tsx`
- **Domain Models**: `src/domain/orders.ts`
- **Order Statuses**: draft, pending_approval, confirmed, rejected, cancelled
- **Fulfillment Statuses**: unfulfilled, partially_fulfilled, shipped, delivered, returned
- **Payment Statuses**: unpaid, partially_paid, paid, refunded

---

## 7. Route Management

### Purpose
Route Management provides comprehensive tools for planning, optimizing, and tracking sales routes and customer visits.

### Key Features

#### 7.1 Route Overview
- **Functionality**: Comprehensive route listing
  - Active routes
  - Route status tracking
  - Customer assignments
  - Visit schedules
  - Performance metrics
- **User Experience**: Data grid with route information
- **Filtering**: Territory, status, sales rep filters

#### 7.2 Route Detail
- **Purpose**: Comprehensive route information and management
- **Key Sections**:

##### 7.2.1 Route Information
- Route name and description
- Territory
- Assigned sales rep
- Visit frequency
- Estimated duration
- Total distance
- Route status

##### 7.2.2 Interactive Map
- **Functionality**: Visual route representation
  - Customer locations on map
  - Route path visualization
  - Customer markers with popups
  - Visit status indicators
- **User Experience**: Interactive Leaflet map
- **Technical Implementation**: React Leaflet integration

##### 7.2.3 Customer List
- Assigned customers
- Customer details
- Visit schedules
- Visit history
- Quick actions (start visit, create order)

##### 7.2.4 Visit Management
- Scheduled visits
- Visit status tracking
- Visit duration
- Visit notes
- Issues and resolutions

##### 7.2.5 Route Performance
- Completion rate
- Total visits
- Completed visits
- Average visit duration
- On-time rate
- Total orders from route
- Total value from route

##### 7.2.6 Route Optimization
- **Functionality**: Optimize route sequence
  - Distance optimization
  - Time optimization
  - Estimated savings
  - New sequence generation
- **User Experience**: Before/after comparison
- **Technical Implementation**: Backend optimization algorithm (future)

#### 7.3 Route Analytics
- **Functionality**: Advanced route analytics
  - Total routes and active routes
  - Total customers covered
  - Average completion rate
  - Total distance traveled
  - Visits today (scheduled vs completed)
  - Pending issues
  - Territory coverage
  - Rep performance
- **User Experience**: Charts and metrics
- **Business Value**: Identifies route efficiency and optimization opportunities

### Route Statuses

- **Active**: Route currently in use
- **Inactive**: Route temporarily disabled
- **Draft**: Route being planned
- **Completed**: Route completed for period

### Visit Statuses

- **Scheduled**: Visit planned
- **In Progress**: Visit currently happening
- **Completed**: Visit successfully completed
- **Cancelled**: Visit cancelled
- **Rescheduled**: Visit rescheduled to another time

### User Workflows

#### For Sales Representatives
1. Navigate to Routes → Overview
2. View assigned routes
3. Check visit schedule
4. Start visit from map or list
5. Complete visit with notes
6. Create order during visit

#### For Route Managers (RSM/TDM)
1. Navigate to Routes → Overview
2. Create new routes
3. Assign customers to routes
4. Optimize route sequence
5. Review route performance
6. Analyze route analytics

### Technical Details
- **Components**:
  - `src/pages/Routes/Overview.tsx`
  - `src/pages/Routes/RouteDetail.tsx`
  - `src/pages/Routes/Analytics.tsx`
- **Domain Models**: `src/domain/routes.ts`
- **Map Integration**: Leaflet and React Leaflet
- **Route Optimization**: Backend algorithm (future)

---

## 8. Target Management

### Purpose
Target Management provides comprehensive tools for setting, tracking, and managing sales targets across customers, SKUs, regions, and time periods.

### Key Features

#### 8.1 Target Overview
- **Functionality**: Comprehensive target listing
  - Target batches by period
  - Target status (draft, submitted, approved, rejected)
  - Regional targets
  - Performance vs targets
- **User Experience**: Data grid with target information
- **Filtering**: Period, region, status filters

#### 8.2 Create Targets
- **Purpose**: Excel-like interface for target setting
- **Key Features**:

##### 8.2.1 Progressive Filters
- Period selection (Month, Quarter, FY)
- Region selection
- RSM selection
- Customer filtering

##### 8.2.2 Excel-Like Grid
- **Functionality**: Grid interface for target entry
  - Rows: Customers
  - Columns: SKUs
  - Cells: Target quantities (cases/units)
  - Row totals
  - Column totals
  - Grand totals
- **User Experience**: Familiar Excel-like interface
- **Technical Implementation**: Custom grid component with virtualization

##### 8.2.3 SKU Column Management
- Add SKU columns
- Remove SKU columns
- Reorder columns
- Column totals

##### 8.2.4 Regional Target Validation
- Regional target input
- SKU target input
- Validation against customer totals
- Error highlighting

##### 8.2.5 Summary Statistics
- Total cases
- Total value
- Customer count
- SKU count
- Average target per customer

##### 8.2.6 Actions
- Save as draft
- Submit for approval
- Export to Excel
- Import from Excel (future)

#### 8.3 Target Workflow

1. **Draft**: Target batch being created
2. **Submitted**: Target batch submitted for approval
3. **Approved**: Target batch approved by manager
4. **Rejected**: Target batch rejected by manager

### User Workflows

#### For RSM/TDM
1. Navigate to Targets → Create
2. Select period and region
3. Add SKU columns
4. Enter customer-SKU targets
5. Validate regional targets
6. Save as draft or submit for approval

#### For Managers
1. Navigate to Targets → Overview
2. Review pending approvals
3. Approve or reject target batches
4. Review target performance

### Technical Details
- **Components**:
  - `src/pages/Targets/index.tsx`
  - `src/pages/Targets/Create.tsx`
  - `src/pages/Targets/components/TargetGrid.tsx`
- **Domain Models**: `src/domain/targets.ts`
- **State Management**: Custom hook `useTargetGrid` for grid state
- **Grid Implementation**: Custom virtualized grid component

---

## 9. Marketing Management

### Purpose
Marketing Management provides tools for managing marketing campaigns and promotions.

### Key Features

#### 9.1 Campaigns
- **Functionality**: Campaign management
  - Campaign listing
  - Campaign details
  - Budget tracking
  - Performance metrics
- **User Experience**: Campaign cards and detail views
- **Status**: Coming soon

#### 9.2 Promotions
- **Functionality**: Promotion management
  - Promotion listing
  - Promotion details
  - Discount tracking
  - Performance metrics
- **User Experience**: Promotion cards and detail views
- **Status**: Coming soon

### User Workflows

#### For Marketing Team
1. Navigate to Marketing → Campaigns
2. Create new campaign
3. Set budget and dates
4. Track campaign performance

### Technical Details
- **Components**:
  - `src/pages/Campaigns/index.tsx`
  - `src/pages/Promotions/index.tsx`
- **Status**: Under development

---

## 10. Resources Management

### Purpose
Resources Management provides a centralized document library for storing and accessing training materials, documents, and resources.

### Key Features

#### 10.1 Resource Library
- **Functionality**: Comprehensive resource listing
  - Search and filter capabilities
  - Resource categorization
  - Resource types (PDF, DOC, Excel, Video, Link, FAQ)
  - Role-based access control
- **User Experience**: Card-based layout with filters
- **Filtering**: Category, type, tags, role

#### 10.2 Resource Details
- Resource title and description
- Resource type and category
- Upload information
- Download count
- Tags
- Visibility roles

#### 10.3 Resource Actions
- View resource
- Download resource
- Favorite resource
- Share resource

### User Workflows

#### For All Users
1. Navigate to Resources
2. Search or filter resources
3. View resource details
4. Download or view resource
5. Favorite frequently used resources

#### For Administrators
1. Navigate to Resources
2. Upload new resource
3. Categorize resource
4. Set visibility roles
5. Manage resource library

### Technical Details
- **Components**: `src/pages/Resources/index.tsx`
- **Domain Models**: `src/domain/resources.ts`
- **Resource Types**: pdf, doc, excel, video, link, faq
- **Access Control**: Role-based visibility

---

## Common Patterns Across Features

### 1. Filtering
- Date range filters
- Region filters
- Channel filters
- Status filters
- Search functionality

### 2. Data Visualization
- KPI cards
- Charts (line, bar, pie, area)
- Tables and grids
- Maps (for routes)

### 3. Workflow Management
- Draft → Submit → Approve/Reject
- Status tracking
- Event history
- Audit trail

### 4. Role-Based Access
- Feature-level access control
- Data-level filtering
- Action-level permissions

### 5. Real-Time Updates
- Live data refresh
- Status updates
- Notification system (future)

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-27  
**Author**: Development Team

