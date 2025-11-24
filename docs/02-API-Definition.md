# API Definition

## Overview

This document defines the RESTful API endpoints, request/response models, and error handling for the Sales Backoffice application. The API follows RESTful principles and uses JSON for data exchange.

## Base URL

```
Production: https://api.sales-backoffice.com/v1
Development: http://localhost:5000/api/v1
Staging: https://staging-api.sales-backoffice.com/v1
```

## Authentication

All API requests (except authentication endpoints) require authentication using JWT (JSON Web Token).

### Authentication Header
```
Authorization: Bearer <jwt_token>
```

### Token Refresh
Tokens expire after 24 hours. Use the refresh token endpoint to obtain a new access token.

## Common Response Models

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2025-01-27T10:00:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  },
  "timestamp": "2025-01-27T10:00:00Z"
}
```

### Pagination Response
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalPages": 10,
    "totalItems": 200,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

## Error Models

### Standard Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `AUTH_REQUIRED` | 401 | Authentication required |
| `AUTH_INVALID` | 401 | Invalid authentication token |
| `AUTH_EXPIRED` | 401 | Authentication token expired |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `CONFLICT` | 409 | Resource conflict |
| `SERVER_ERROR` | 500 | Internal server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

### Error Response Model
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: {
      field?: string;
      value?: any;
      constraint?: string;
    }[];
  };
  timestamp: string;
}
```

## API Endpoints

### 1. Authentication

#### 1.1 Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "u1",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "executive"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

#### 1.2 Refresh Token
**POST** `/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

#### 1.3 Logout
**POST** `/auth/logout`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### 1.4 Get Current User
**GET** `/auth/me`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "u1",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "executive",
    "regionId": "r1",
    "permissions": ["read:orders", "write:orders"]
  }
}
```

### 2. Sales Data

#### 2.1 Get Sales Overview
**GET** `/sales/overview`

**Query Parameters:**
- `from` (string, required): Start date (ISO 8601)
- `to` (string, required): End date (ISO 8601)
- `region` (string, optional): Region filter
- `channel` (string, optional): Channel filter

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 5000000,
    "totalOrders": 1500,
    "averageOrderValue": 3333.33,
    "growthRate": 12.5,
    "byRegion": [
      {
        "region": "Ikeja",
        "revenue": 1500000,
        "orders": 450
      }
    ],
    "byChannel": [
      {
        "channel": "Modern Trade",
        "revenue": 2000000,
        "orders": 600
      }
    ]
  }
}
```

#### 2.2 Get Direct Sales Data
**GET** `/sales/direct`

**Query Parameters:**
- `from` (string, required): Start date (ISO 8601)
- `to` (string, required): End date (ISO 8601)
- `region` (string, optional): Region filter
- `channel` (string, optional): Channel filter

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 3000000,
    "totalCases": 50000,
    "totalUnits": 600000,
    "byBrand": [
      {
        "brand": "Pepsi",
        "revenue": 1200000,
        "cases": 20000,
        "units": 240000
      }
    ],
    "byCategory": [
      {
        "category": "RGB",
        "revenue": 1500000,
        "cases": 25000,
        "units": 300000
      }
    ]
  }
}
```

#### 2.3 Get UOM Comparison
**GET** `/sales/uom-comparison`

**Query Parameters:**
- `from` (string, required): Start date (ISO 8601)
- `to` (string, required): End date (ISO 8601)
- `region` (string, optional): Region filter

**Response:**
```json
{
  "success": true,
  "data": {
    "cases": {
      "total": 50000,
      "byBrand": { ... },
      "byCategory": { ... }
    },
    "units": {
      "total": 600000,
      "byBrand": { ... },
      "byCategory": { ... }
    },
    "conversionRate": 12
  }
}
```

#### 2.4 Get Retention Data
**GET** `/sales/retention`

**Query Parameters:**
- `from` (string, required): Start date (ISO 8601)
- `to` (string, required): End date (ISO 8601)
- `region` (string, optional): Region filter

**Response:**
```json
{
  "success": true,
  "data": {
    "retentionRate": 85.5,
    "newCustomers": 150,
    "lostCustomers": 25,
    "byPeriod": [
      {
        "period": "2025-01",
        "retentionRate": 87.2,
        "newCustomers": 50,
        "lostCustomers": 8
      }
    ]
  }
}
```

### 3. Payments

#### 3.1 Get Payments Overview
**GET** `/payments/overview`

**Query Parameters:**
- `from` (string, required): Start date (ISO 8601)
- `to` (string, required): End date (ISO 8601)
- `region` (string, optional): Region filter

**Response:**
```json
{
  "success": true,
  "data": {
    "allRevenueAmount": "5000000.00",
    "successfulTransactionsCount": 1200,
    "failedTransactionsCount": 50,
    "bankRevenue": [
      {
        "bankName": "GTB",
        "amount": "1500000.00",
        "providerCode": "GTB",
        "logoImage": "https://...",
        "paymentType": 1,
        "rawAmount": 1500000
      }
    ]
  }
}
```

#### 3.2 Get Payment Details
**GET** `/payments/:paymentId`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 12345,
    "token": "abc123",
    "amount": 50000,
    "customerId": "c1",
    "email": "customer@example.com",
    "orderId": "o1",
    "transactionReference": "TXN123456",
    "paymentStatus": "Successful",
    "naration": "Payment for Order #12345",
    "customerName": "ABC Stores",
    "paidAmount": 50000,
    "customerFee": 0,
    "merchantFee": 1500,
    "vendorTransactionRef": "VENDOR123",
    "paymentProvider": "Paystack",
    "paymentDate": "2025-01-27T10:00:00Z",
    "bankName": "GTB",
    "invoiceCreated": true,
    "invoiceNumber": "INV-12345",
    "processed": true,
    "processedDate": "2025-01-27T10:05:00Z",
    "navisionProcessed": true,
    "notificationReceived": true,
    "paymentType": 1,
    "regionCode": "IKEJA",
    "createdDate": "2025-01-27T09:55:00Z"
  }
}
```

#### 3.3 Get Payment Analytics
**GET** `/payments/analytics`

**Query Parameters:**
- `from` (string, required): Start date (ISO 8601)
- `to` (string, required): End date (ISO 8601)
- `region` (string, optional): Region filter

**Response:**
```json
{
  "success": true,
  "data": {
    "regionalCollection": [
      {
        "amount": 1500000,
        "text": "1.5M",
        "description": "Ikeja Region"
      }
    ],
    "dailyCollection": [
      {
        "amount": 500000,
        "text": "500K",
        "description": "2025-01-27"
      }
    ],
    "collectionByBank": [
      {
        "amount": 1000000,
        "text": "1M",
        "description": "GTB"
      }
    ]
  }
}
```

### 4. Customers

#### 4.1 Get Customers
**GET** `/customers`

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `pageSize` (number, optional): Items per page (default: 20)
- `search` (string, optional): Search query
- `region` (string, optional): Region filter
- `channel` (string, optional): Channel filter
- `status` (string, optional): Status filter (Active, OnHold, Inactive)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "c1",
      "code": "CUST001",
      "name": "ABC Stores",
      "status": "Active",
      "channel": "ModernTrade",
      "region": "Ikeja",
      "revenue": 500000,
      "ordersCount": 150
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalPages": 10,
    "totalItems": 200
  }
}
```

#### 4.2 Get Customer Details
**GET** `/customers/:customerId`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "c1",
    "code": "CUST001",
    "name": "ABC Stores",
    "status": "Active",
    "channel": "ModernTrade",
    "segment": "Premium",
    "region": "Ikeja",
    "route": "Route 1",
    "address": {
      "line1": "123 Main Street",
      "city": "Lagos",
      "state": "Lagos",
      "lat": 6.5244,
      "lng": 3.3792
    },
    "contacts": [
      {
        "role": "Primary",
        "name": "John Doe",
        "phone": "+2348012345678",
        "email": "john@abcstores.com"
      }
    ],
    "paymentTerms": "Net30",
    "priceTier": "Tier 1",
    "owner": {
      "repId": "r1",
      "repName": "Sales Rep 1",
      "tdm": "TDM 1",
      "rsm": "RSM 1"
    },
    "credit": {
      "limit": 1000000,
      "exposure": 500000,
      "aging": {
        "b0_30": 300000,
        "b31_60": 150000,
        "b61_90": 50000,
        "b90p": 0
      },
      "dsoDays": 25,
      "holds": []
    },
    "kpis": {
      "last90dRevenue": 500000,
      "ytdRevenue": 2000000,
      "ordersCount90d": 50,
      "aov": 10000,
      "fillRatePct": 95.5,
      "onTimePct": 98.2,
      "priceCompliancePct": 100,
      "returnRatePct": 2.5,
      "visitCompliancePct": 90.0
    },
    "revenueTrend": [
      {
        "month": "2025-01",
        "actual": 200000,
        "target": 180000
      }
    ]
  }
}
```

#### 4.3 Get Customer Orders
**GET** `/customers/:customerId/orders`

**Query Parameters:**
- `page` (number, optional): Page number
- `pageSize` (number, optional): Items per page
- `from` (string, optional): Start date
- `to` (string, optional): End date
- `status` (string, optional): Order status filter

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "o1",
      "number": "ORD-12345",
      "date": "2025-01-27",
      "status": "Delivered",
      "cases": 100,
      "lines": 5,
      "value": 50000,
      "fillRatePct": 95.5,
      "onTime": true
    }
  ],
  "pagination": { ... }
}
```

#### 4.4 Get Customer Payments
**GET** `/customers/:customerId/payments`

**Query Parameters:**
- `page` (number, optional): Page number
- `pageSize` (number, optional): Items per page
- `from` (string, optional): Start date
- `to` (string, optional): End date

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "p1",
      "receiptNo": "RCP-12345",
      "date": "2025-01-27",
      "method": "BankTransfer",
      "provider": "GTB",
      "amount": 50000,
      "success": true,
      "reference": "TXN123456",
      "appliedTo": [
        {
          "invoiceNo": "INV-12345",
          "amount": 50000
        }
      ]
    }
  ],
  "pagination": { ... }
}
```

### 5. Orders

#### 5.1 Get Orders
**GET** `/orders`

**Query Parameters:**
- `page` (number, optional): Page number
- `pageSize` (number, optional): Items per page
- `from` (string, optional): Start date
- `to` (string, optional): End date
- `region` (string, optional): Region filter
- `channel` (string, optional): Channel filter
- `status` (string, optional): Order status filter
- `fulfillmentStatus` (string, optional): Fulfillment status filter
- `paymentStatus` (string, optional): Payment status filter
- `customer` (string, optional): Customer filter
- `salesRep` (string, optional): Sales rep filter

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "o1",
      "order_no": "ORD-12345",
      "customer_id": "c1",
      "sales_rep_id": "r1",
      "region_id": "reg1",
      "channel_id": "ch1",
      "ordered_at": "2025-01-27T10:00:00Z",
      "required_at": "2025-01-30T10:00:00Z",
      "status": "confirmed",
      "fulfillment_status": "delivered",
      "payment_status": "paid",
      "currency": "NGN",
      "subtotal_ngn": 50000,
      "discount_ngn": 0,
      "tax_ngn": 0,
      "shipping_ngn": 0,
      "total_ngn": 50000,
      "notes": "Urgent delivery required"
    }
  ],
  "pagination": { ... }
}
```

#### 5.2 Get Order Details
**GET** `/orders/:orderId`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "o1",
    "order_no": "ORD-12345",
    "customer_id": "c1",
    "sales_rep_id": "r1",
    "region_id": "reg1",
    "channel_id": "ch1",
    "ordered_at": "2025-01-27T10:00:00Z",
    "required_at": "2025-01-30T10:00:00Z",
    "status": "confirmed",
    "fulfillment_status": "delivered",
    "payment_status": "paid",
    "currency": "NGN",
    "subtotal_ngn": 50000,
    "discount_ngn": 0,
    "tax_ngn": 0,
    "shipping_ngn": 0,
    "total_ngn": 50000,
    "notes": "Urgent delivery required",
    "customer": {
      "id": "c1",
      "code": "CUST001",
      "name": "ABC Stores",
      "region": "Ikeja",
      "channel": "Modern Trade"
    },
    "salesRep": {
      "id": "r1",
      "name": "Sales Rep 1",
      "role": "SalesRep"
    },
    "lines": [
      {
        "id": "l1",
        "order_id": "o1",
        "sku_id": "sku1",
        "uom": "cases",
        "qty": 100,
        "qty_fulfilled": 100,
        "price_ngn": 500,
        "line_value_ngn": 50000,
        "discount_ngn": 0,
        "sku": {
          "id": "sku1",
          "code": "SKU001",
          "name": "Pepsi PET 50cl",
          "category": "RGB"
        }
      }
    ],
    "events": [
      {
        "id": "e1",
        "order_id": "o1",
        "kind": "submitted",
        "at": "2025-01-27T10:00:00Z",
        "by_user_id": "r1",
        "note": "Order submitted"
      }
    ]
  }
}
```

#### 5.3 Create Order
**POST** `/orders`

**Request Body:**
```json
{
  "customer_id": "c1",
  "required_at": "2025-01-30T10:00:00Z",
  "lines": [
    {
      "sku_id": "sku1",
      "uom": "cases",
      "qty": 100,
      "price_ngn": 500
    }
  ],
  "notes": "Urgent delivery required"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "o1",
    "order_no": "ORD-12345",
    ...
  }
}
```

#### 5.4 Update Order
**PUT** `/orders/:orderId`

**Request Body:**
```json
{
  "required_at": "2025-01-31T10:00:00Z",
  "lines": [
    {
      "sku_id": "sku1",
      "uom": "cases",
      "qty": 150,
      "price_ngn": 500
    }
  ],
  "notes": "Updated order"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "o1",
    ...
  }
}
```

#### 5.5 Approve Order
**POST** `/orders/:orderId/approve`

**Request Body:**
```json
{
  "note": "Approved by manager"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "o1",
    "status": "confirmed",
    ...
  }
}
```

#### 5.6 Reject Order
**POST** `/orders/:orderId/reject`

**Request Body:**
```json
{
  "note": "Rejected: Insufficient credit limit"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "o1",
    "status": "rejected",
    ...
  }
}
```

#### 5.7 Get Order Analytics
**GET** `/orders/analytics`

**Query Parameters:**
- `from` (string, required): Start date
- `to` (string, required): End date
- `region` (string, optional): Region filter
- `channel` (string, optional): Channel filter

**Response:**
```json
{
  "success": true,
  "data": {
    "totalOrders": 1500,
    "orderValue": 5000000,
    "avgOrderValue": 3333.33,
    "fulfilled": 1400,
    "pending": 100,
    "onTimeDelivery": 95.5,
    "returnsRate": 2.5,
    "byStatus": {
      "confirmed": 1200,
      "pending_approval": 100,
      "rejected": 50,
      "cancelled": 150
    },
    "byFulfillmentStatus": {
      "delivered": 1400,
      "shipped": 50,
      "unfulfilled": 50
    },
    "byPaymentStatus": {
      "paid": 1300,
      "partially_paid": 100,
      "unpaid": 100
    }
  }
}
```

### 6. Routes

#### 6.1 Get Routes
**GET** `/routes`

**Query Parameters:**
- `page` (number, optional): Page number
- `pageSize` (number, optional): Items per page
- `status` (string, optional): Route status filter
- `territory` (string, optional): Territory filter
- `repId` (string, optional): Sales rep filter

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "rt1",
      "name": "Route 1",
      "description": "Ikeja Central Route",
      "status": "active",
      "territory": "Ikeja",
      "repId": "r1",
      "repName": "Sales Rep 1",
      "customers": ["c1", "c2", "c3"],
      "visitFrequency": "weekly",
      "estimatedDuration": 480,
      "totalDistance": 50.5,
      "lastOptimized": "2025-01-20T10:00:00Z",
      "createdAt": "2025-01-01T10:00:00Z",
      "updatedAt": "2025-01-27T10:00:00Z",
      "createdBy": "rsm1"
    }
  ],
  "pagination": { ... }
}
```

#### 6.2 Get Route Details
**GET** `/routes/:routeId`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "rt1",
    "name": "Route 1",
    "description": "Ikeja Central Route",
    "status": "active",
    "territory": "Ikeja",
    "repId": "r1",
    "repName": "Sales Rep 1",
    "customers": ["c1", "c2", "c3"],
    "visitFrequency": "weekly",
    "estimatedDuration": 480,
    "totalDistance": 50.5,
    "lastOptimized": "2025-01-20T10:00:00Z",
    "createdAt": "2025-01-01T10:00:00Z",
    "updatedAt": "2025-01-27T10:00:00Z",
    "createdBy": "rsm1",
    "customerDetails": [
      {
        "id": "c1",
        "code": "CUST001",
        "name": "ABC Stores",
        "address": {
          "line1": "123 Main Street",
          "city": "Lagos",
          "state": "Lagos",
          "lat": 6.5244,
          "lng": 3.3792
        }
      }
    ],
    "visits": [
      {
        "id": "v1",
        "routeId": "rt1",
        "customerId": "c1",
        "customerName": "ABC Stores",
        "repId": "r1",
        "repName": "Sales Rep 1",
        "scheduledDate": "2025-01-28",
        "scheduledTime": "09:00",
        "status": "scheduled"
      }
    ],
    "performance": {
      "totalVisits": 100,
      "completedVisits": 95,
      "completionRate": 95.0,
      "totalOrders": 50,
      "totalValue": 2500000,
      "averageVisitDuration": 45,
      "totalDistance": 500,
      "onTimeRate": 90.0
    }
  }
}
```

#### 6.3 Create Route
**POST** `/routes`

**Request Body:**
```json
{
  "name": "Route 1",
  "description": "Ikeja Central Route",
  "territory": "Ikeja",
  "repId": "r1",
  "customers": ["c1", "c2", "c3"],
  "visitFrequency": "weekly",
  "estimatedDuration": 480
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "rt1",
    ...
  }
}
```

#### 6.4 Update Route
**PUT** `/routes/:routeId`

**Request Body:**
```json
{
  "name": "Route 1 Updated",
  "customers": ["c1", "c2", "c3", "c4"],
  "visitFrequency": "bi-weekly"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "rt1",
    ...
  }
}
```

#### 6.5 Optimize Route
**POST** `/routes/:routeId/optimize`

**Response:**
```json
{
  "success": true,
  "data": {
    "routeId": "rt1",
    "optimizedAt": "2025-01-27T10:00:00Z",
    "originalDistance": 60.5,
    "optimizedDistance": 50.5,
    "savings": 16.5,
    "newSequence": ["c1", "c3", "c2"],
    "estimatedTimeSavings": 30
  }
}
```

#### 6.6 Get Route Analytics
**GET** `/routes/analytics`

**Query Parameters:**
- `from` (string, optional): Start date
- `to` (string, optional): End date
- `region` (string, optional): Region filter

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRoutes": 50,
    "activeRoutes": 45,
    "totalCustomers": 500,
    "averageCompletionRate": 90.5,
    "totalDistance": 2500,
    "totalVisitsToday": 100,
    "completedVisitsToday": 95,
    "pendingIssues": 5,
    "territoryCoverage": [
      {
        "territory": "Ikeja",
        "routes": 10,
        "customers": 100,
        "completionRate": 92.0
      }
    ],
    "repPerformance": [
      {
        "repId": "r1",
        "repName": "Sales Rep 1",
        "routes": 5,
        "completionRate": 95.0,
        "totalVisits": 100,
        "totalOrders": 50
      }
    ]
  }
}
```

### 7. Targets

#### 7.1 Get Targets
**GET** `/targets`

**Query Parameters:**
- `page` (number, optional): Page number
- `pageSize` (number, optional): Items per page
- `periodId` (string, optional): Period filter
- `regionId` (string, optional): Region filter
- `status` (string, optional): Batch status filter

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "tb1",
      "period_id": "p1",
      "region_id": "reg1",
      "owner_user_id": "rsm1",
      "status": "approved",
      "note": "Q1 2025 Targets",
      "created_by": "rsm1",
      "created_at": "2025-01-01T10:00:00Z",
      "period": {
        "id": "p1",
        "label": "2025-Q1",
        "kind": "Quarter",
        "start_date": "2025-01-01",
        "end_date": "2025-03-31"
      },
      "region": {
        "id": "reg1",
        "name": "Ikeja"
      },
      "owner": {
        "id": "rsm1",
        "name": "RSM 1",
        "role": "RSM"
      }
    }
  ],
  "pagination": { ... }
}
```

#### 7.2 Get Target Details
**GET** `/targets/:targetId`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "tb1",
    "period_id": "p1",
    "region_id": "reg1",
    "owner_user_id": "rsm1",
    "status": "approved",
    "note": "Q1 2025 Targets",
    "created_by": "rsm1",
    "created_at": "2025-01-01T10:00:00Z",
    "period": {
      "id": "p1",
      "label": "2025-Q1",
      "kind": "Quarter",
      "start_date": "2025-01-01",
      "end_date": "2025-03-31"
    },
    "region": {
      "id": "reg1",
      "name": "Ikeja"
    },
    "owner": {
      "id": "rsm1",
      "name": "RSM 1",
      "role": "RSM"
    },
    "rows": [
      {
        "id": "tr1",
        "batch_id": "tb1",
        "period_id": "p1",
        "customer_id": "c1",
        "sku_id": "sku1",
        "owner_user_id": "r1",
        "uom": "cases",
        "target_qty": 1000,
        "target_value_ngn": 500000,
        "customer": {
          "id": "c1",
          "code": "CUST001",
          "name": "ABC Stores",
          "region_id": "reg1",
          "channel_id": "ch1",
          "dealer_type_id": "dt1"
        },
        "sku": {
          "id": "sku1",
          "code": "SKU001",
          "brand": "Pepsi",
          "category": "RGB",
          "size_ml": 500,
          "pack_type": "Bottle (PET RB)",
          "name": "Pepsi PET 50cl"
        },
        "owner": {
          "id": "r1",
          "name": "Sales Rep 1",
          "role": "SalesRep"
        }
      }
    ]
  }
}
```

#### 7.3 Create Target Batch
**POST** `/targets`

**Request Body:**
```json
{
  "period_id": "p1",
  "region_id": "reg1",
  "note": "Q1 2025 Targets",
  "rows": [
    {
      "customer_id": "c1",
      "sku_id": "sku1",
      "owner_user_id": "r1",
      "uom": "cases",
      "target_qty": 1000
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "tb1",
    "status": "draft",
    ...
  }
}
```

#### 7.4 Update Target Batch
**PUT** `/targets/:targetId`

**Request Body:**
```json
{
  "note": "Updated Q1 2025 Targets",
  "rows": [
    {
      "customer_id": "c1",
      "sku_id": "sku1",
      "owner_user_id": "r1",
      "uom": "cases",
      "target_qty": 1200
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "tb1",
    ...
  }
}
```

#### 7.5 Submit Target Batch
**POST** `/targets/:targetId/submit`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "tb1",
    "status": "submitted",
    ...
  }
}
```

#### 7.6 Approve Target Batch
**POST** `/targets/:targetId/approve`

**Request Body:**
```json
{
  "note": "Approved by manager"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "tb1",
    "status": "approved",
    ...
  }
}
```

#### 7.7 Reject Target Batch
**POST** `/targets/:targetId/reject`

**Request Body:**
```json
{
  "note": "Rejected: Targets too high"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "tb1",
    "status": "rejected",
    ...
  }
}
```

### 8. Marketing

#### 8.1 Get Campaigns
**GET** `/marketing/campaigns`

**Query Parameters:**
- `page` (number, optional): Page number
- `pageSize` (number, optional): Items per page
- `status` (string, optional): Campaign status filter

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "camp1",
      "name": "Summer Promotion 2025",
      "description": "Summer sales campaign",
      "startDate": "2025-06-01",
      "endDate": "2025-08-31",
      "status": "active",
      "budget": 5000000,
      "spent": 2500000
    }
  ],
  "pagination": { ... }
}
```

#### 8.2 Get Promotions
**GET** `/marketing/promotions`

**Query Parameters:**
- `page` (number, optional): Page number
- `pageSize` (number, optional): Items per page
- `status` (string, optional): Promotion status filter

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "promo1",
      "name": "Buy 2 Get 1 Free",
      "description": "Special promotion",
      "startDate": "2025-01-01",
      "endDate": "2025-01-31",
      "status": "active",
      "discount": 33.33
    }
  ],
  "pagination": { ... }
}
```

### 9. Resources

#### 9.1 Get Resources
**GET** `/resources`

**Query Parameters:**
- `page` (number, optional): Page number
- `pageSize` (number, optional): Items per page
- `search` (string, optional): Search query
- `category` (string, optional): Category filter
- `type` (string, optional): Type filter (pdf, doc, excel, video, link, faq)
- `tags` (string[], optional): Tag filters

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "res1",
      "title": "Sales Training Guide",
      "description": "Comprehensive sales training guide",
      "type": "pdf",
      "category_id": "cat1",
      "tags": ["training", "sales"],
      "url": "https://...",
      "uploaded_by": "u1",
      "uploaded_at": "2025-01-01T10:00:00Z",
      "status": "active",
      "visibility_roles": ["executive", "gtm"],
      "category": {
        "id": "cat1",
        "name": "Training",
        "description": "Training materials"
      },
      "uploadedBy": {
        "id": "u1",
        "name": "Admin",
        "role": "Admin"
      },
      "downloadCount": 150
    }
  ],
  "pagination": { ... }
}
```

#### 9.2 Upload Resource
**POST** `/resources`

**Request Body (multipart/form-data):**
```
file: <file>
title: "Sales Training Guide"
description: "Comprehensive sales training guide"
type: "pdf"
category_id: "cat1"
tags: ["training", "sales"]
visibility_roles: ["executive", "gtm"]
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "res1",
    ...
  }
}
```

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **Authentication endpoints**: 5 requests per minute
- **Read endpoints**: 100 requests per minute
- **Write endpoints**: 50 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1643200000
```

## Versioning

API versioning is handled via URL path:
- Current version: `/v1`
- Future versions: `/v2`, `/v3`, etc.

## Webhooks (Future)

Webhooks will be available for:
- Order status changes
- Payment confirmations
- Target approvals
- Route updates

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-27  
**Author**: Development Team

