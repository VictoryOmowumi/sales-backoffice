# Architecture and Integrations

## Overview

This document describes the system architecture, integration patterns, and technical design decisions for the Sales Backoffice application. It covers both the current frontend architecture and the planned backend architecture and integrations.

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Frontend Architecture](#2-frontend-architecture)
3. [Backend Architecture (Planned)](#3-backend-architecture-planned)
4. [Integration Architecture](#4-integration-architecture)
5. [Data Flow](#5-data-flow)
6. [Security Architecture](#6-security-architecture)
7. [Deployment Architecture](#7-deployment-architecture)
8. [Scalability Considerations](#8-scalability-considerations)
9. [Monitoring and Observability](#9-monitoring-and-observability)

---

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         React Frontend Application                   │   │
│  │  (Vite + TypeScript + React + TanStack Query)        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/REST API
                            │
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         .NET Core Web API                             │   │
│  │  (ASP.NET Core + Entity Framework Core)               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                     │
┌───────▼──────┐   ┌────────▼────────┐   ┌───────▼──────┐
│   Database   │   │  External APIs  │   │   Services   │
│   (SQL/      │   │  (Payment       │   │  (Auth,      │
│   PostgreSQL)│   │   Gateways,     │   │   Cache,     │
│              │   │   ERP, etc.)    │   │   Queue)     │
└──────────────┘   └─────────────────┘   └──────────────┘
```

### 1.2 Architecture Principles

- **Separation of Concerns**: Clear separation between frontend, backend, and data layers
- **API-First Design**: RESTful API as the primary interface
- **Stateless Backend**: Backend services are stateless for scalability
- **Client-Side State Management**: Frontend manages UI state, backend manages business state
- **Microservices Ready**: Architecture supports future microservices migration

---

## 2. Frontend Architecture

### 2.1 Technology Stack

#### Core Framework
- **React 19.1.1**: UI library
- **TypeScript 5.8.3**: Type-safe development
- **Vite 7.1.2**: Build tool and dev server

#### State Management
- **Zustand 5.0.8**: Lightweight state management for client-side state
- **TanStack Query 5.85.5**: Server state management and caching
- **React Context API**: Authentication and theme management

#### UI Libraries
- **Radix UI**: Accessible component primitives
- **shadcn/ui**: Component library built on Radix UI
- **Tailwind CSS 4.1.12**: Utility-first CSS framework
- **Material-UI 7.3.1**: Additional UI components
- **MUI X Data Grid 8.10.2**: Advanced data grid component

#### Data Visualization
- **ECharts 5.6.0**: Charting library
- **echarts-for-react 3.0.2**: React wrapper for ECharts
- **Recharts 3.1.2**: Alternative charting library

#### Maps
- **Leaflet 1.9.4**: Interactive maps
- **react-leaflet 5.0.0**: React wrapper for Leaflet

#### Routing
- **React Router DOM 7.8.2**: Client-side routing

### 2.2 Frontend Architecture Patterns

#### 2.2.1 Component Architecture

```
src/
├── components/          # Reusable UI components
│   ├── charts/         # Chart components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── layout/         # Layout components
│   └── widgets/        # Widget components
├── pages/              # Page components (route components)
├── layouts/            # Page layouts
├── hooks/              # Custom React hooks
├── store/              # Zustand stores
├── context/            # React contexts
├── providers/          # Context providers
├── domain/             # Domain models and types
├── data/               # Mock data generators
├── lib/                # Utility libraries
└── utils/              # Utility functions
```

#### 2.2.2 State Management Strategy

**Client State (Zustand)**
- UI state (filters, sidebar, favorites, recents)
- Component-specific state
- User preferences

**Server State (TanStack Query)**
- API data
- Caching
- Background refetching
- Optimistic updates

**Context State (React Context)**
- Authentication state
- Theme state
- Global application state

#### 2.2.3 Data Fetching Pattern

```typescript
// Example: Using TanStack Query
const { data, isLoading, error } = useQuery({
  queryKey: ['orders', filters],
  queryFn: () => fetchOrders(filters),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});
```

#### 2.2.4 Routing Pattern

```typescript
// Protected routes with role-based access
<ProtectedRoute roles={['executive', 'gtm']}>
  <DashboardLayout>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/executive" element={<Executive />} />
      ...
    </Routes>
  </DashboardLayout>
</ProtectedRoute>
```

### 2.3 Frontend Build and Deployment

#### Build Process
1. TypeScript compilation
2. React component bundling
3. CSS processing (Tailwind)
4. Asset optimization
5. Code splitting
6. Production build

#### Deployment
- **Static Hosting**: Vercel, Netlify, or AWS S3 + CloudFront
- **CDN**: CloudFront, Cloudflare
- **Environment Variables**: Separate configs for dev, staging, production

---

## 3. Backend Architecture (Planned)

### 3.1 Technology Stack

#### Core Framework
- **.NET 8**: Runtime and framework
- **ASP.NET Core**: Web API framework
- **Entity Framework Core**: ORM
- **C#**: Programming language

#### Database
-  **SQL Server**: Primary database
- **Redis**: Caching and session storage

#### Authentication & Authorization
- **JWT (JSON Web Tokens)**: Authentication
- **ASP.NET Core Identity**: User management (optional)
- **Role-Based Access Control (RBAC)**: Authorization

#### API Documentation
- **Swagger/OpenAPI**: API documentation

### 3.2 Backend Architecture Patterns

#### 3.2.1 Layered Architecture

```
SalesBackoffice.API/
├── Controllers/          # API Controllers
├── Services/            # Business Logic Services
├── Repositories/         # Data Access Layer
├── Domain/              # Domain Models
├── Infrastructure/       # Infrastructure Services
│   ├── Database/
│   ├── Caching/
│   ├── External APIs/
│   └── Messaging/
└── Middleware/          # Custom Middleware
```

#### 3.2.2 Service Layer Pattern

```csharp
// Example: Order Service
public interface IOrderService
{
    Task<Order> CreateOrderAsync(CreateOrderRequest request);
    Task<Order> UpdateOrderAsync(ID orderId, UpdateOrderRequest request);
    Task<Order> ApproveOrderAsync(ID orderId, string? note = null);
    Task<PagedResult<Order>> GetOrdersAsync(OrderFilter filter);
}

public class OrderService : IOrderService
{
    private readonly IOrderRepository _repository;
    private readonly ICustomerService _customerService;
    private readonly IUnitOfWork _unitOfWork;
    
    // Implementation
}
```

#### 3.2.3 Repository Pattern

```csharp
// Example: Order Repository
public interface IOrderRepository : IRepository<Order>
{
    Task<PagedResult<Order>> GetOrdersAsync(OrderFilter filter);
    Task<Order?> GetOrderWithDetailsAsync(ID orderId);
}

public class OrderRepository : IOrderRepository
{
    private readonly ApplicationDbContext _context;
    
    // Implementation
}
```

#### 3.2.4 Unit of Work Pattern

```csharp
public interface IUnitOfWork : IDisposable
{
    IOrderRepository Orders { get; }
    ICustomerRepository Customers { get; }
    // ... other repositories
    
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}
```

### 3.3 API Design

#### 3.3.1 RESTful API Principles

- **Resource-Based URLs**: `/api/v1/orders`, `/api/v1/customers`
- **HTTP Methods**: GET, POST, PUT, DELETE, PATCH
- **Status Codes**: Standard HTTP status codes
- **JSON Format**: Request and response in JSON
- **Versioning**: URL-based versioning (`/api/v1/`, `/api/v2/`)

#### 3.3.2 API Response Format

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2025-01-27T10:00:00Z"
}
```

#### 3.3.3 Error Handling

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "customerId",
        "value": null,
        "constraint": "required"
      }
    ]
  },
  "timestamp": "2025-01-27T10:00:00Z"
}
```

### 3.4 Database Access

#### 3.4.1 Entity Framework Core

```csharp
public class ApplicationDbContext : DbContext
{
    public DbSet<Order> Orders { get; set; }
    public DbSet<Customer> Customers { get; set; }
    // ... other DbSets
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure entities
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
```

#### 3.4.2 Migrations

```bash
# Create migration
dotnet ef migrations add MigrationName

# Apply migration
dotnet ef database update

# Rollback migration
dotnet ef database update PreviousMigrationName
```

---

## 4. Integration Architecture

### 4.1 External API Integrations

#### 4.1.1 Payment Gateway Integrations


**Bank API Integrations**
- ABVA (Access Bank Virtual Account)
- ZBVA (Zenith Bank Virtual Account)
- GBVA (GTBank Virtual Account)
- GTB (Guaranty Trust Bank)

#### 4.1.2 ERP Integration (NAVISION/SAP)

**Integration Pattern**
```
Backend API → NAVISION/SAP API → NAVISION/SAP System
           ←                ←
```

#### 4.1.3 Mapping Services

**Leaflet/OpenStreetMap** (Current)
- Client-side map rendering
- Route visualization
- Customer location display

**Google Maps API** (Future)
- Alternative mapping service
- Geocoding
- Route optimization
- Traffic data

### 4.2 Integration Patterns

#### 4.2.1 API Gateway Pattern

```
Client → API Gateway → Microservices
                    → External APIs
                    → Database
```

**Benefits**
- Centralized authentication
- Rate limiting
- Request/response transformation
- API versioning

#### 4.2.2 Circuit Breaker Pattern

```csharp
// Example: Circuit breaker for external API calls
public class PaymentGatewayClient
{
    private readonly CircuitBreaker _circuitBreaker;
    
    public async Task<PaymentResult> ProcessPaymentAsync(PaymentRequest request)
    {
        return await _circuitBreaker.ExecuteAsync(async () =>
        {
            // Call external payment API
            return await _httpClient.PostAsync(...);
        });
    }
}
```

#### 4.2.3 Retry Pattern

```csharp
// Example: Retry policy for external API calls
var retryPolicy = Policy
    .Handle<HttpRequestException>()
    .OrResult<HttpResponseMessage>(r => !r.IsSuccessStatusCode)
    .WaitAndRetryAsync(
        retryCount: 3,
        sleepDurationProvider: retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)),
        onRetry: (outcome, timespan, retryCount, context) =>
        {
            // Log retry attempt
        });
```

#### 4.2.4 Webhook Pattern (Future)

```
External System → Webhook Endpoint → Backend API → Database
                                      → Notification Service
```

**Use Cases**
- Payment confirmations
- Order status updates
- External system notifications

### 4.3 Message Queue Integration (Future)

#### 4.3.1 RabbitMQ / Azure Service Bus

**Use Cases**
- Asynchronous order processing
- Payment processing
- Email notifications
- Report generation

**Pattern**
```
API → Message Queue → Background Workers
                   → Notification Service
                   → Report Generator
```

---

## 5. Data Flow

### 5.1 Request Flow

```
1. User Action (Frontend)
   ↓
2. React Component Event Handler
   ↓
3. TanStack Query Mutation/Query
   ↓
4. Axios HTTP Request
   ↓
5. API Gateway (Authentication, Rate Limiting)
   ↓
6. Controller (Request Validation)
   ↓
7. Service Layer (Business Logic)
   ↓
8. Repository (Data Access)
   ↓
9. Database (Data Persistence)
   ↓
10. Response Flow (Reverse)
```

### 5.2 Data Synchronization

#### 5.2.1 Real-Time Updates (Future)

**WebSocket Pattern**
```
Client ←→ WebSocket Server ←→ Backend API
                              ←→ Database
```

**Use Cases**
- Live order status updates
- Real-time notifications
- Live dashboard updates

#### 5.2.2 Polling Pattern (Current)

```typescript
// Example: Polling for order status
const { data } = useQuery({
  queryKey: ['order', orderId],
  queryFn: () => fetchOrder(orderId),
  refetchInterval: 5000, // Poll every 5 seconds
});
```

### 5.3 Caching Strategy

#### 5.3.1 Client-Side Caching (TanStack Query)

```typescript
// Cache configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});
```

#### 5.3.2 Server-Side Caching (Redis)

```csharp
// Example: Redis caching
public class CachedOrderService : IOrderService
{
    private readonly IOrderService _orderService;
    private readonly IDistributedCache _cache;
    
    public async Task<Order> GetOrderAsync(ID orderId)
    {
        var cacheKey = $"order:{orderId}";
        var cached = await _cache.GetStringAsync(cacheKey);
        
        if (cached != null)
        {
            return JsonSerializer.Deserialize<Order>(cached);
        }
        
        var order = await _orderService.GetOrderAsync(orderId);
        await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(order),
            new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
            });
        
        return order;
    }
}
```

---

## 6. Security Architecture

### 6.1 Authentication

#### 6.1.1 JWT-Based Authentication

```
1. User Login → Backend API
2. Backend validates credentials
3. Backend generates JWT token
4. Token returned to client
5. Client stores token (sessionStorage/localStorage)
6. Client includes token in subsequent requests
7. Backend validates token on each request
```

#### 6.1.2 Token Refresh

```
1. Access token expires
2. Client requests refresh with refresh token
3. Backend validates refresh token
4. Backend generates new access token
5. New token returned to client
```

### 6.2 Authorization

#### 6.2.1 Role-Based Access Control (RBAC)

```csharp
// Example: Role-based authorization
[Authorize(Roles = "Executive,GTM")]
public class ExecutiveDashboardController : ControllerBase
{
    // Only Executive and GTM roles can access
}
```

#### 6.2.2 Resource-Based Authorization

```csharp
// Example: Resource-based authorization
public async Task<IActionResult> GetOrder(ID orderId)
{
    var order = await _orderService.GetOrderAsync(orderId);
    
    // Check if user has access to this order
    if (!await _authorizationService.AuthorizeAsync(User, order, "ReadOrder"))
    {
        return Forbid();
    }
    
    return Ok(order);
}
```

### 6.3 Data Security

#### 6.3.1 Encryption

- **Data at Rest**: Database encryption
- **Data in Transit**: HTTPS/TLS
- **Sensitive Data**: Field-level encryption (PII, payment info)

#### 6.3.2 Input Validation

```csharp
// Example: Input validation
public class CreateOrderRequest
{
    [Required]
    public ID CustomerId { get; set; }
    
    [Required]
    [MinLength(1)]
    public IReadOnlyList<OrderLineRequest> Lines { get; set; }
    
    [MaxLength(1000)]
    public string? Notes { get; set; }
}
```

#### 6.3.3 SQL Injection Prevention

- Use parameterized queries (EF Core)
- Avoid raw SQL queries
- Input sanitization

### 6.4 API Security

#### 6.4.1 Rate Limiting

```csharp
// Example: Rate limiting
services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("fixed", opt =>
    {
        opt.Window = TimeSpan.FromMinutes(1);
        opt.PermitLimit = 100;
    });
});
```

#### 6.4.2 CORS Configuration

```csharp
// Example: CORS configuration
services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", builder =>
    {
        builder
            .WithOrigins("https://app.sales-backoffice.com")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});
```

---

## 7. Deployment Architecture

### 7.1 Frontend Deployment

#### 7.1.1 Static Hosting

**Options**
- **Control panel**: Recommended for React apps
- **Windows IIS Server**: Fallback option


**Deployment Process**
1. Build production bundle
2. Upload to hosting service
3. Configure CDN
4. Set environment variables
5. Configure custom domain

#### 7.1.2 CI/CD Pipeline

```
Git Push → GitHub Actions → Build → Test → Deploy
```

**GitHub Actions Workflow**
```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      - run: npm run test
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

### 7.2 Backend Deployment

#### 7.2.1 Containerization

**Dockerfile**
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["SalesBackoffice.API/SalesBackoffice.API.csproj", "SalesBackoffice.API/"]
RUN dotnet restore "SalesBackoffice.API/SalesBackoffice.API.csproj"
COPY . .
WORKDIR "/src/SalesBackoffice.API"
RUN dotnet build "SalesBackoffice.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SalesBackoffice.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SalesBackoffice.API.dll"]
```

#### 7.2.2 Hosting Options

**Options**
- **Azure App Service**: Recommended for .NET apps
- **AWS Elastic Beanstalk**: AWS option
- **Docker Containers**: Kubernetes, Docker Swarm
- **On-Premise**: IIS, Linux servers

#### 7.2.3 Database Deployment

**Options**
- **Azure SQL Database**: Managed SQL Server
- **AWS RDS**: Managed PostgreSQL/SQL Server
- **On-Premise**: Self-hosted database

**Migration Strategy**
- EF Core Migrations
- Database versioning
- Rollback procedures

### 7.3 Infrastructure as Code (Future)

#### 7.3.1 Terraform / ARM Templates

**Infrastructure Components**
- Virtual machines
- Databases
- Load balancers
- Networking
- Security groups

---

## 8. Scalability Considerations

### 8.1 Horizontal Scaling

#### 8.1.1 Load Balancing

```
Client → Load Balancer → Backend Instance 1
                      → Backend Instance 2
                      → Backend Instance N
```

**Load Balancing Strategies**
- Round-robin
- Least connections
- IP hash

#### 8.1.2 Database Scaling

**Read Replicas**
```
Write → Primary Database
Read  → Read Replica 1
      → Read Replica 2
      → Read Replica N
```

**Sharding** (Future)
- Partition data by region
- Partition data by customer
- Horizontal partitioning

### 8.2 Vertical Scaling

- Increase server resources (CPU, RAM)
- Upgrade database tier
- Optimize queries and indexes

### 8.3 Caching Strategy

- **Application-Level Caching**: In-memory cache
- **Distributed Caching**: Redis
- **CDN Caching**: Static assets
- **Database Query Caching**: Query result caching

### 8.4 Performance Optimization

#### 8.4.1 Database Optimization

- Index optimization
- Query optimization
- Connection pooling
- Query result caching

#### 8.4.2 API Optimization

- Response compression
- Pagination
- Field selection
- Batch operations

#### 8.4.3 Frontend Optimization

- Code splitting
- Lazy loading
- Image optimization
- Bundle size optimization

---

## 9. Monitoring and Observability

### 9.1 Logging

#### 9.1.1 Structured Logging

```csharp
// Example: Structured logging
_logger.LogInformation("Order created: {OrderId} by {UserId}",
    orderId, userId);
```

**Log Levels**
- **Trace**: Detailed diagnostic information
- **Debug**: Debugging information
- **Information**: General information
- **Warning**: Warning messages
- **Error**: Error messages
- **Critical**: Critical failures

#### 9.1.2 Log Aggregation

**Tools**
- **Application Insights**: Azure
- **CloudWatch**: AWS
- **ELK Stack**: Elasticsearch, Logstash, Kibana
- **Splunk**: Enterprise logging

### 9.2 Monitoring

#### 9.2.1 Application Performance Monitoring (APM)

**Metrics**
- Response times
- Request rates
- Error rates
- Database query performance
- External API call performance

**Tools**
- **Application Insights**: Azure
- **New Relic**: APM platform
- **Datadog**: Monitoring platform

#### 9.2.2 Infrastructure Monitoring

**Metrics**
- CPU usage
- Memory usage
- Disk I/O
- Network I/O
- Database performance

**Tools**
- **Azure Monitor**: Azure
- **CloudWatch**: AWS
- **Prometheus + Grafana**: Open-source

### 9.3 Alerting

#### 9.3.1 Alert Rules

- **Error Rate**: Alert when error rate exceeds threshold
- **Response Time**: Alert when response time exceeds threshold
- **Availability**: Alert when service is down
- **Resource Usage**: Alert when resource usage exceeds threshold

#### 9.3.2 Notification Channels

- Email
- SMS
- Slack
- Microsoft Teams
- PagerDuty

### 9.4 Health Checks

```csharp
// Example: Health check endpoint
app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});

services.AddHealthChecks()
    .AddDbContextCheck<ApplicationDbContext>()
    .AddRedis(redisConnectionString)
    .AddCheck<ExternalApiHealthCheck>("external_api");
```

---

## 10. Future Enhancements

### 10.1 Microservices Architecture

**Potential Microservices**
- Order Service
- Customer Service
- Payment Service
- Route Service
- Target Service
- Notification Service

### 10.2 Event-Driven Architecture

**Event Bus**
- RabbitMQ
- Azure Service Bus
- Apache Kafka

**Event Types**
- OrderCreated
- OrderApproved
- PaymentReceived
- CustomerUpdated

### 10.3 GraphQL API (Future)

**Benefits**
- Flexible querying
- Reduced over-fetching
- Single endpoint
- Type-safe queries

### 10.4 Real-Time Features

**WebSocket Integration**
- Live order updates
- Real-time notifications
- Live dashboard updates
- Collaborative features

### 10.5 Mobile Application

**Native Mobile Apps**
- React Native
- Flutter
- Native iOS/Android

**Features**
- Offline capability
- GPS tracking
- Photo capture
- Push notifications

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-27  
**Author**: Development Team

