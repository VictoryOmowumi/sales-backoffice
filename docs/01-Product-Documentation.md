# Product Documentation

## 1. Overview

The Sales Backoffice is a comprehensive web-based application designed to manage and optimize sales operations for a beverage distribution company. The system provides real-time visibility into sales performance, customer relationships, order management, payment processing, route optimization, and target setting across multiple regions and channels.

## 2. Purpose

The primary purpose of this application is to:

- **Centralize Sales Operations**: Provide a single source of truth for all sales-related data and activities
- **Enable Data-Driven Decisions**: Offer comprehensive analytics and reporting capabilities for executives and sales teams
- **Streamline Workflows**: Automate and optimize sales processes from order creation to payment collection
- **Improve Customer Relationships**: Track customer interactions, credit management, and service quality
- **Optimize Field Operations**: Manage routes, visits, and territory coverage efficiently
- **Support Strategic Planning**: Facilitate target setting, tracking, and performance management

## 3. Target Users

### 3.1 Executive Users
- **Role**: `executive`
- **Responsibilities**: Strategic oversight, high-level analytics, cross-functional decision making
- **Key Features**: Executive dashboard, comprehensive analytics, resource management

### 3.2 Go-To-Market (GTM) Team
- **Role**: `gtm`
- **Responsibilities**: Market strategy, route analytics, resource allocation
- **Key Features**: Route analytics, executive dashboards, resource management

### 3.3 Sales Representatives
- **Role**: `sales`
- **Responsibilities**: Daily sales activities, customer visits, order management
- **Key Features**: Order creation, customer management, route execution

### 3.4 Regional Sales Managers (RSM)
- **Role**: `RSM` (in targets domain)
- **Responsibilities**: Regional target setting, team management, performance monitoring
- **Key Features**: Target creation and approval, regional analytics

### 3.5 Territory Development Managers (TDM)
- **Role**: `TDM` (in targets domain)
- **Responsibilities**: Territory-level target management, sales rep supervision
- **Key Features**: Target management, territory analytics

### 3.6 Territory Development Executives (TDE)
- **Role**: `TDE` (in targets domain)
- **Responsibilities**: Field execution, customer relationship management
- **Key Features**: Order management, customer visits

## 4. Features & Functionality

### 4.1 Home Dashboard
- Personalized greeting and quick access to key functions
- Daily goals and metrics (revenue, visits, approvals)
- Upcoming events and calendar
- Pending approvals and tasks
- Quick action buttons for common tasks
- Command palette (⌘K / Ctrl+K) for quick navigation

### 4.2 Executive Dashboard
- High-level KPIs and metrics
- Revenue trends and forecasts
- Market share analysis
- Cross-regional performance comparison
- Strategic insights and recommendations

### 4.3 Direct Sales Management
- **Overview**: Performance metrics, brand analysis, location insights, group performance
- **UOM Comparison**: Unit of Measure (cases vs units) analysis
- **Retention Analysis**: Customer retention metrics and trends
- Real-time filtering by region, channel, date range
- Interactive charts and visualizations

### 4.4 Payments Management
- **Overview**: Payment collection dashboard
  - Total revenue tracking
  - Bank-wise revenue breakdown
  - Successful vs failed transactions
  - Payment provider analytics
- **Payment Details**: Individual transaction details
  - Transaction reference tracking
  - Payment status monitoring
  - Invoice linkage
  - Processing status

### 4.5 Customer Management
- **Overview**: Customer analytics and KPIs
  - Active customer count
  - Revenue by customer segment
  - Customer health metrics
- **Customer Directory**: Comprehensive customer listing
  - Search and filter capabilities
  - Customer status tracking
  - Contact information management
- **Customer Detail**: Individual customer profiles
  - Credit management (limits, exposure, aging)
  - Order history
  - Payment history
  - Visit tracking
  - Return claims
  - Activity timeline
  - KPIs (revenue, fill rate, on-time delivery, etc.)

### 4.6 Order Management
- **Overview**: Order listing and management
  - Order status tracking
  - Fulfillment status monitoring
  - Payment status tracking
  - Filtering and search capabilities
- **Order Analytics**: Order performance metrics
  - Order trends
  - Status distribution
  - Fulfillment rates
  - Value analysis
- **Order Detail**: Comprehensive order information
  - Order lines and SKU details
  - Customer information
  - Sales rep details
  - Order events timeline
  - Status history

### 4.7 Route Management
- **Overview**: Route listing and management
  - Active route tracking
  - Customer assignment
  - Visit scheduling
  - Route status monitoring
- **Route Analytics**: Route performance metrics
  - Completion rates
  - Visit frequency analysis
  - Territory coverage
  - Rep performance
- **Route Detail**: Individual route information
  - Interactive map visualization (Leaflet)
  - Customer locations
  - Visit history
  - Route optimization suggestions
  - Performance metrics

### 4.8 Target Management
- **Overview**: Target tracking and performance
  - Target vs actual comparison
  - Period-wise analysis
  - Regional performance
- **Create Targets**: Excel-like grid interface
  - Period selection (Month/Quarter/FY)
  - Region and RSM filtering
  - SKU column management
  - Customer-SKU target entry
  - Draft saving
  - Submission and approval workflow
  - Regional target validation
  - Progressive filtering

### 4.9 Marketing
- **Campaigns**: Marketing campaign management
- **Promotions**: Promotional activity tracking

### 4.10 Resources
- Document library management
- Role-based resource access
- Resource categorization (PDF, DOC, Excel, Video, Link, FAQ)
- Search and filter capabilities
- Favorites and download tracking

### 4.11 Help & Support
- User guides and documentation
- FAQ section
- Support contact information

## 5. Flows & Business Logic

### 5.1 Order Lifecycle Flow
```
1. Order Creation (Sales Rep)
   ↓
2. Order Submission
   ↓
3. Pending Approval
   ↓
4. Approval/Rejection (Manager)
   ↓
5. Order Confirmation
   ↓
6. Packing
   ↓
7. Shipping
   ↓
8. Delivery
   ↓
9. Payment Processing
   ↓
10. Invoice Generation
```

**Order Statuses**:
- `draft`: Order being created
- `pending_approval`: Awaiting manager approval
- `confirmed`: Approved and confirmed
- `rejected`: Rejected by manager
- `cancelled`: Order cancelled

**Fulfillment Statuses**:
- `unfulfilled`: Not yet processed
- `partially_fulfilled`: Partially shipped
- `shipped`: In transit
- `delivered`: Delivered to customer
- `returned`: Returned by customer

**Payment Statuses**:
- `unpaid`: No payment received
- `partially_paid`: Partial payment
- `paid`: Fully paid
- `refunded`: Payment refunded

### 5.2 Target Setting Flow
```
1. Select Period (Month/Quarter/FY)
   ↓
2. Select Region (optional)
   ↓
3. Select RSM (optional)
   ↓
4. Add SKU Columns
   ↓
5. Enter Customer-SKU Targets
   ↓
6. Validate Regional Targets
   ↓
7. Save as Draft / Submit for Approval
   ↓
8. Approval Workflow (RSM/TDM)
   ↓
9. Target Activation
```

**Target Batch Statuses**:
- `draft`: Being created
- `submitted`: Submitted for approval
- `approved`: Approved and active
- `rejected`: Rejected by approver

### 5.3 Payment Processing Flow
```
1. Order Confirmation
   ↓
2. Payment Initiation (Customer)
   ↓
3. Payment Provider Processing
   ↓
4. Payment Status Update
   ↓
5. Invoice Creation (if successful)
   ↓
6. NAVISION Processing (if applicable)
   ↓
7. Notification Sent
```

**Payment Types**:
- Type 1: Direct Payment
- Type 2: Virtual Account Payment

**Payment Providers**:
- ABVA, ZBVA, GBVA, GTB (Banks)
- Paystack, Flutterwave, Interswitch (Payment Gateways)

### 5.4 Route Execution Flow
```
1. Route Planning (RSM/TDM)
   ↓
2. Customer Assignment
   ↓
3. Visit Scheduling
   ↓
4. Route Optimization
   ↓
5. Visit Execution (Sales Rep)
   ↓
6. Visit Completion
   ↓
7. Order Creation (if applicable)
   ↓
8. Performance Tracking
```

**Route Statuses**:
- `active`: Currently active
- `inactive`: Temporarily inactive
- `draft`: Being planned
- `completed`: Completed for period

**Visit Statuses**:
- `scheduled`: Planned visit
- `in_progress`: Currently executing
- `completed`: Successfully completed
- `cancelled`: Cancelled visit
- `rescheduled`: Rescheduled to another time

### 5.5 Customer Credit Management Flow
```
1. Credit Limit Assignment
   ↓
2. Order Placement
   ↓
3. Credit Exposure Calculation
   ↓
4. Aging Analysis (0-30, 31-60, 61-90, 90+ days)
   ↓
5. Credit Hold (if threshold exceeded)
   ↓
6. Payment Application
   ↓
7. Credit Release (if conditions met)
```

## 6. Roles and Permissions

### 6.1 Role Hierarchy
```
Executive
  ├── GTM Team
  │     ├── RSM (Regional Sales Manager)
  │     │     ├── TDM (Territory Development Manager)
  │     │     │     ├── TDE (Territory Development Executive)
  │     │     │     └── SalesRep
  │     │     └── SalesRep
  │     └── SalesRep
  └── Admin
```

### 6.2 Permission Matrix

| Feature | Executive | GTM | Sales | RSM | TDM | TDE | SalesRep |
|---------|-----------|-----|-------|-----|-----|-----|----------|
| Executive Dashboard | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Direct Sales Overview | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Payments Overview | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Customer Overview | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Order Management | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Route Overview | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Route Analytics | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Target Overview | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Targets | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Approve Targets | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Resources | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Campaigns | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Promotions | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### 6.3 Data Access Rules

- **Region-Based Access**: RSM, TDM, TDE, and SalesRep can only access data for their assigned regions
- **Customer-Based Access**: SalesRep can only access customers assigned to their routes
- **Order-Based Access**: SalesRep can only view/modify orders they created
- **Target-Based Access**: RSM can create targets for their region; TDM for their territory

## 7. Technology Stack

### 7.1 Frontend Framework
- **React 19.1.1**: UI library
- **TypeScript 5.8.3**: Type-safe development
- **Vite 7.1.2**: Build tool and dev server

### 7.2 UI Libraries & Components
- **Radix UI**: Accessible component primitives
  - Avatar, Checkbox, Dialog, Dropdown Menu, Label, Popover, Progress, Radio Group, Scroll Area, Select, Separator, Switch, Tabs, Tooltip
- **Tailwind CSS 4.1.12**: Utility-first CSS framework
- **shadcn/ui**: Component library built on Radix UI
- **Material-UI (MUI) 7.3.1**: Additional UI components
- **MUI X Data Grid 8.10.2**: Advanced data grid component

### 7.3 State Management
- **Zustand 5.0.8**: Lightweight state management
  - Filters store
  - Favorites store
  - Recents store
  - Sidebar state
  - Compare store
- **React Context API**: Authentication and theme management
- **TanStack Query 5.85.5**: Server state management and caching

### 7.4 Routing
- **React Router DOM 7.8.2**: Client-side routing

### 7.5 Data Visualization
- **ECharts 5.6.0**: Charting library
- **echarts-for-react 3.0.2**: React wrapper for ECharts
- **Recharts 3.1.2**: Alternative charting library

### 7.6 Maps
- **Leaflet 1.9.4**: Interactive maps
- **react-leaflet 5.0.0**: React wrapper for Leaflet

### 7.7 Utilities
- **Axios 1.11.0**: HTTP client (for future API integration)
- **date-fns 4.1.0**: Date manipulation
- **dayjs 1.11.13**: Date library
- **numeral 2.0.6**: Number formatting
- **@faker-js/faker 9.9.0**: Mock data generation

### 7.8 Development Tools
- **ESLint 9.33.0**: Code linting
- **TypeScript ESLint**: TypeScript-specific linting rules

### 7.9 Additional Libraries
- **lucide-react 0.541.0**: Icon library
- **phosphor-react 1.4.1**: Additional icons
- **react-icons 5.5.0**: Icon library
- **sonner 2.0.7**: Toast notifications
- **cmdk 1.1.1**: Command palette component
- **motion 12.23.12**: Animation library
- **next-themes 0.4.6**: Theme management

## 8. Architecture

### 8.1 Application Structure
```
src/
├── components/        # Reusable UI components
│   ├── charts/       # Chart components
│   ├── command/     # Command palette
│   ├── filters/     # Filter components
│   ├── layout/      # Layout components
│   ├── maps/        # Map components
│   ├── routing/     # Route tracking
│   ├── targets/     # Target-specific components
│   ├── ui/          # Base UI components
│   └── widgets/     # Widget components
├── config/          # Configuration files
├── constants/       # Application constants
├── context/         # React contexts
├── data/            # Mock data generators
├── domain/          # Domain models and types
├── hooks/           # Custom React hooks
├── layouts/         # Page layouts
├── lib/             # Utility libraries
├── pages/           # Page components
├── providers/       # Context providers
├── routes/          # Route definitions
├── store/           # Zustand stores
├── types/           # TypeScript types
└── utils/           # Utility functions
```

### 8.2 Design Patterns

#### 8.2.1 Component Architecture
- **Atomic Design**: Components organized by complexity (atoms → molecules → organisms)
- **Composition**: Small, reusable components composed into larger features
- **Separation of Concerns**: UI components separated from business logic

#### 8.2.2 State Management
- **Local State**: React `useState` for component-specific state
- **Global State**: Zustand for shared application state
- **Server State**: TanStack Query for API data management
- **Context API**: Authentication and theme state

#### 8.2.3 Data Flow
```
API/Backend → TanStack Query → Components
User Actions → Event Handlers → State Updates → UI Re-render
```

### 8.3 Routing Architecture
- **Protected Routes**: Authentication-based route protection
- **Role-Based Access**: Route-level permission checking
- **Nested Routes**: Hierarchical route structure for complex pages
- **Lazy Loading**: Code splitting for optimal performance

### 8.4 Styling Architecture
- **Tailwind CSS**: Utility-first CSS framework
- **CSS Variables**: Theme customization via CSS variables
- **Component Variants**: CVA (Class Variance Authority) for component variants
- **Responsive Design**: Mobile-first approach

## 9. API Integrations (Future)

### 9.1 Planned Integrations

#### 9.1.1 Authentication Service
- **Endpoint**: `/api/auth`
- **Purpose**: User authentication and authorization
- **Methods**: Login, Logout, Token Refresh, User Profile

#### 9.1.2 Sales Data Service
- **Endpoint**: `/api/sales`
- **Purpose**: Sales performance data
- **Methods**: Get Sales Overview, Get Direct Sales Data, Get UOM Comparison, Get Retention Data

#### 9.1.3 Payment Service
- **Endpoint**: `/api/payments`
- **Purpose**: Payment transaction management
- **Methods**: Get Payments Overview, Get Payment Details, Get Payment Analytics

#### 9.1.4 Customer Service
- **Endpoint**: `/api/customers`
- **Purpose**: Customer data management
- **Methods**: Get Customers, Get Customer Details, Update Customer, Get Customer Orders

#### 9.1.5 Order Service
- **Endpoint**: `/api/orders`
- **Purpose**: Order management
- **Methods**: Get Orders, Get Order Details, Create Order, Update Order, Approve Order

#### 9.1.6 Route Service
- **Endpoint**: `/api/routes`
- **Purpose**: Route and visit management
- **Methods**: Get Routes, Get Route Details, Create Route, Update Route, Get Route Analytics

#### 9.1.7 Target Service
- **Endpoint**: `/api/targets`
- **Purpose**: Target setting and tracking
- **Methods**: Get Targets, Create Target Batch, Update Target, Approve Target, Get Target Performance

#### 9.1.8 Marketing Service
- **Endpoint**: `/api/marketing`
- **Purpose**: Campaign and promotion management
- **Methods**: Get Campaigns, Create Campaign, Get Promotions, Create Promotion

#### 9.1.9 Resource Service
- **Endpoint**: `/api/resources`
- **Purpose**: Document and resource management
- **Methods**: Get Resources, Upload Resource, Download Resource, Update Resource

### 9.2 Integration Patterns

#### 9.2.1 RESTful API
- Standard HTTP methods (GET, POST, PUT, DELETE, PATCH)
- JSON request/response format
- RESTful resource naming conventions

#### 9.2.2 Authentication
- JWT (JSON Web Tokens) for authentication
- Token-based authorization
- Refresh token mechanism

#### 9.2.3 Error Handling
- Standardized error response format
- HTTP status codes
- Error message localization

#### 9.2.4 Caching Strategy
- TanStack Query for client-side caching
- Cache invalidation strategies
- Optimistic updates

### 9.3 Third-Party Integrations (Future)

#### 9.3.1 Payment Gateways
- Paystack integration
- Flutterwave integration
- Interswitch integration
- Bank API integrations (ABVA, ZBVA, GBVA, GTB)

#### 9.3.2 ERP Integration
- NAVISION integration for invoice processing
- Order synchronization
- Inventory management

#### 9.3.3 Mapping Services
- Google Maps API (alternative to OpenStreetMap)
- Route optimization services
- Geocoding services

#### 9.3.4 Analytics Services
- Business intelligence tools
- Reporting services
- Data warehouse integration

## 10. Security Considerations

### 10.1 Authentication
- Secure password storage (hashed)
- Session management
- Token expiration
- Multi-factor authentication (future)

### 10.2 Authorization
- Role-based access control (RBAC)
- Resource-level permissions
- Data filtering based on user role

### 10.3 Data Protection
- HTTPS encryption
- Input validation
- SQL injection prevention
- XSS protection
- CSRF protection

### 10.4 Privacy
- Customer data protection
- GDPR compliance (if applicable)
- Data retention policies
- Audit logging

## 11. Performance Considerations

### 11.1 Frontend Optimization
- Code splitting and lazy loading
- Image optimization
- Bundle size optimization
- Caching strategies

### 11.2 Data Loading
- Pagination for large datasets
- Virtual scrolling for lists
- Debounced search and filters
- Optimistic UI updates

### 11.3 Caching
- Client-side caching with TanStack Query
- Browser caching for static assets
- API response caching

## 12. Future Enhancements

### 12.1 Mobile Application
- Native mobile app for field sales reps
- Offline capability
- GPS tracking
- Photo capture for visits

### 12.2 Advanced Analytics
- Predictive analytics
- Machine learning for demand forecasting
- Automated insights and recommendations

### 12.3 Automation
- Automated route optimization
- Automated target suggestions
- Automated report generation
- Workflow automation

### 12.4 Integration Enhancements
- Real-time data synchronization
- Webhook support
- API webhooks for external systems
- Data export capabilities

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-27  
**Author**: Development Team

