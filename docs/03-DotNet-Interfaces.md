# .NET Interfaces & Class Definitions

## Overview

This document defines the .NET interfaces and class definitions for the Sales Backoffice backend API. These interfaces are based on the domain models used in the frontend application and provide a contract for the backend implementation.

## Namespace Structure

```
SalesBackoffice.Domain
├── Common
├── Authentication
├── Sales
├── Payments
├── Customers
├── Orders
├── Routes
├── Targets
├── Marketing
└── Resources
```

## Common Types

### ID Type
```csharp
namespace SalesBackoffice.Domain.Common
{
    public record ID(string Value);
}
```

### Money Type
```csharp
namespace SalesBackoffice.Domain.Common
{
    public record Money
    {
        public decimal Amount { get; init; }
        public string Currency { get; init; } = "NGN";
    }
}
```

### Period Types
```csharp
namespace SalesBackoffice.Domain.Common
{
    public enum PeriodKind
    {
        Month,
        Quarter,
        FY
    }

    public record Period
    {
        public ID Id { get; init; }
        public string Label { get; init; }
        public PeriodKind Kind { get; init; }
        public DateTime StartDate { get; init; }
        public DateTime EndDate { get; init; }
    }
}
```

## Authentication Domain

### User Role
```csharp
namespace SalesBackoffice.Domain.Authentication
{
    public enum UserRole
    {
        Executive,
        GTM,
        Sales,
        Admin,
        RSM,
        TDM,
        TDE,
        SalesRep
    }
}
```

### User
```csharp
namespace SalesBackoffice.Domain.Authentication
{
    public record User
    {
        public ID Id { get; init; }
        public string Name { get; init; }
        public string Email { get; init; }
        public UserRole Role { get; init; }
        public ID? RegionId { get; init; }
        public ID? ManagerId { get; init; }
        public DateTime CreatedAt { get; init; }
        public DateTime? UpdatedAt { get; init; }
    }
}
```

### Authentication Interfaces
```csharp
namespace SalesBackoffice.Domain.Authentication
{
    public interface IAuthenticationService
    {
        Task<AuthenticationResult> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
        Task<AuthenticationResult> RefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default);
        Task LogoutAsync(string userId, CancellationToken cancellationToken = default);
        Task<User?> GetCurrentUserAsync(string userId, CancellationToken cancellationToken = default);
    }

    public record LoginRequest(string Email, string Password);
    
    public record AuthenticationResult
    {
        public User User { get; init; }
        public string AccessToken { get; init; }
        public string RefreshToken { get; init; }
        public int ExpiresIn { get; init; }
    }
}
```

## Sales Domain

### Region
```csharp
namespace SalesBackoffice.Domain.Sales
{
    public record Region
    {
        public ID Id { get; init; }
        public string Name { get; init; }
    }

    public static class Regions
    {
        public static readonly string[] All = new[]
        {
            "Abuja", "Kano", "Kaduna", "Aba", "Enugu",
            "Benin", "Ibadan", "Ilorin", "Ikeja"
        };
    }
}
```

### Channel
```csharp
namespace SalesBackoffice.Domain.Sales
{
    public record Channel
    {
        public ID Id { get; init; }
        public string Name { get; init; }
    }

    public static class Channels
    {
        public static readonly string[] All = new[]
        {
            "Modern Trade", "General Trade", "HORECA", "E-Commerce"
        };
    }
}
```

### Category & Brand
```csharp
namespace SalesBackoffice.Domain.Sales
{
    public enum Category
    {
        RGB,
        PET,
        Water,
        Energy
    }

    public enum Brand
    {
        Pepsi,
        Mirinda,
        Teem,
        Aquafina,
        LiptonIceTea,
        SupaKomando,
        Rockstar
    }
}
```

### SKU
```csharp
namespace SalesBackoffice.Domain.Sales
{
    public record SKU
    {
        public ID Id { get; init; }
        public string Code { get; init; }
        public Brand Brand { get; init; }
        public Category Category { get; init; }
        public int SizeMl { get; init; }
        public string PackType { get; init; }
        public string Name { get; init; }
    }
}
```

### Sales Data Interfaces
```csharp
namespace SalesBackoffice.Domain.Sales
{
    public interface ISalesService
    {
        Task<SalesOverview> GetSalesOverviewAsync(
            DateTime from,
            DateTime to,
            string? region = null,
            string? channel = null,
            CancellationToken cancellationToken = default);

        Task<DirectSalesData> GetDirectSalesDataAsync(
            DateTime from,
            DateTime to,
            string? region = null,
            string? channel = null,
            CancellationToken cancellationToken = default);

        Task<UOMComparison> GetUOMComparisonAsync(
            DateTime from,
            DateTime to,
            string? region = null,
            CancellationToken cancellationToken = default);

        Task<RetentionData> GetRetentionDataAsync(
            DateTime from,
            DateTime to,
            string? region = null,
            CancellationToken cancellationToken = default);
    }

    public record SalesOverview
    {
        public decimal TotalRevenue { get; init; }
        public int TotalOrders { get; init; }
        public decimal AverageOrderValue { get; init; }
        public decimal GrowthRate { get; init; }
        public IReadOnlyList<RegionSales> ByRegion { get; init; }
        public IReadOnlyList<ChannelSales> ByChannel { get; init; }
    }

    public record RegionSales
    {
        public string Region { get; init; }
        public decimal Revenue { get; init; }
        public int Orders { get; init; }
    }

    public record ChannelSales
    {
        public string Channel { get; init; }
        public decimal Revenue { get; init; }
        public int Orders { get; init; }
    }

    public record DirectSalesData
    {
        public decimal TotalRevenue { get; init; }
        public int TotalCases { get; init; }
        public int TotalUnits { get; init; }
        public IReadOnlyList<BrandSales> ByBrand { get; init; }
        public IReadOnlyList<CategorySales> ByCategory { get; init; }
    }

    public record BrandSales
    {
        public Brand Brand { get; init; }
        public decimal Revenue { get; init; }
        public int Cases { get; init; }
        public int Units { get; init; }
    }

    public record CategorySales
    {
        public Category Category { get; init; }
        public decimal Revenue { get; init; }
        public int Cases { get; init; }
        public int Units { get; init; }
    }

    public record UOMComparison
    {
        public UOMData Cases { get; init; }
        public UOMData Units { get; init; }
        public int ConversionRate { get; init; }
    }

    public record UOMData
    {
        public int Total { get; init; }
        public Dictionary<Brand, int> ByBrand { get; init; }
        public Dictionary<Category, int> ByCategory { get; init; }
    }

    public record RetentionData
    {
        public decimal RetentionRate { get; init; }
        public int NewCustomers { get; init; }
        public int LostCustomers { get; init; }
        public IReadOnlyList<PeriodRetention> ByPeriod { get; init; }
    }

    public record PeriodRetention
    {
        public string Period { get; init; }
        public decimal RetentionRate { get; init; }
        public int NewCustomers { get; init; }
        public int LostCustomers { get; init; }
    }
}
```

## Payments Domain

### Payment Status & Provider
```csharp
namespace SalesBackoffice.Domain.Payments
{
    public enum PaymentStatus
    {
        Successful,
        Failed,
        Pending
    }

    public enum PaymentProvider
    {
        ABVA,
        ZBVA,
        GBVA,
        GTB,
        Paystack,
        Flutterwave,
        Interswitch
    }

    public enum PaymentType
    {
        Direct = 1,
        VirtualAccount = 2
    }
}
```

### Payment Transaction
```csharp
namespace SalesBackoffice.Domain.Payments
{
    public record PaymentTransaction
    {
        public int Id { get; init; }
        public string? Token { get; init; }
        public decimal Amount { get; init; }
        public ID CustomerId { get; init; }
        public string? Email { get; init; }
        public ID OrderId { get; init; }
        public string? SecurityCode { get; init; }
        public string? CollectionBankAccount { get; init; }
        public string? CollectionBankCode { get; init; }
        public string? SourceBankCode { get; init; }
        public string? CustomerAccountNumber { get; init; }
        public string TransactionReference { get; init; }
        public PaymentStatus PaymentStatus { get; init; }
        public string Narration { get; init; }
        public string CustomerName { get; init; }
        public decimal PaidAmount { get; init; }
        public decimal CustomerFee { get; init; }
        public decimal MerchantFee { get; init; }
        public string VendorTransactionRef { get; init; }
        public PaymentProvider PaymentProvider { get; init; }
        public int ApplicationId { get; init; }
        public DateTime PaymentDate { get; init; }
        public string? TellerNo { get; init; }
        public DateTime? TellerCreated { get; init; }
        public string BankAccountCode { get; init; }
        public string BankName { get; init; }
        public string BankDescription { get; init; }
        public bool InvoiceCreated { get; init; }
        public string InvoiceNumber { get; init; }
        public bool Processed { get; init; }
        public DateTime? ProcessedDate { get; init; }
        public bool NavisionProcessed { get; init; }
        public bool NotificationReceived { get; init; }
        public string? Logo { get; init; }
        public PaymentType PaymentType { get; init; }
        public string RegionCode { get; init; }
        public DateTime CreatedDate { get; init; }
    }
}
```

### Payment Interfaces
```csharp
namespace SalesBackoffice.Domain.Payments
{
    public interface IPaymentService
    {
        Task<PaymentsOverview> GetPaymentsOverviewAsync(
            DateTime from,
            DateTime to,
            string? region = null,
            CancellationToken cancellationToken = default);

        Task<PaymentTransaction?> GetPaymentDetailsAsync(
            int paymentId,
            CancellationToken cancellationToken = default);

        Task<PaymentsAnalytics> GetPaymentsAnalyticsAsync(
            DateTime from,
            DateTime to,
            string? region = null,
            CancellationToken cancellationToken = default);
    }

    public record PaymentsOverview
    {
        public string AllRevenueAmount { get; init; }
        public int SuccessfulTransactionsCount { get; init; }
        public int FailedTransactionsCount { get; init; }
        public IReadOnlyList<BankRevenue> BankRevenue { get; init; }
    }

    public record BankRevenue
    {
        public string BankName { get; init; }
        public string Amount { get; init; }
        public PaymentProvider ProviderCode { get; init; }
        public string LogoImage { get; init; }
        public string? BackgroundColor { get; init; }
        public string? TextColor { get; init; }
        public PaymentType PaymentType { get; init; }
        public decimal RawAmount { get; init; }
    }

    public record PaymentsAnalytics
    {
        public IReadOnlyList<RegionalCollection> RegionalCollection { get; init; }
        public IReadOnlyList<DailyCollection> DailyCollection { get; init; }
        public IReadOnlyList<CollectionByBank> CollectionByBank { get; init; }
    }

    public record RegionalCollection
    {
        public decimal Amount { get; init; }
        public string Text { get; init; }
        public string? Description { get; init; }
    }

    public record DailyCollection
    {
        public decimal Amount { get; init; }
        public string Text { get; init; }
        public string? Description { get; init; }
    }

    public record CollectionByBank
    {
        public decimal Amount { get; init; }
        public string Text { get; init; }
        public string Description { get; init; }
    }
}
```

## Customers Domain

### Customer Status & Channel
```csharp
namespace SalesBackoffice.Domain.Customers
{
    public enum CustomerStatus
    {
        Active,
        OnHold,
        Inactive
    }

    public enum CustomerChannel
    {
        ModernTrade,
        GeneralTrade,
        HORECA,
        ECom
    }

    public enum PaymentTerms
    {
        Prepaid,
        COD,
        Net7,
        Net14,
        Net30
    }

    public enum ContactRole
    {
        Primary,
        Finance,
        Receiving
    }
}
```

### Customer
```csharp
namespace SalesBackoffice.Domain.Customers
{
    public record Customer
    {
        public ID Id { get; init; }
        public string Code { get; init; }
        public string Name { get; init; }
        public CustomerStatus Status { get; init; }
        public CustomerChannel Channel { get; init; }
        public string? Segment { get; init; }
        public string Region { get; init; }
        public string? Route { get; init; }
        public Address Address { get; init; }
        public IReadOnlyList<Contact> Contacts { get; init; }
        public PaymentTerms PaymentTerms { get; init; }
        public string? PriceTier { get; init; }
        public CustomerOwner Owner { get; init; }
        public CreditInfo Credit { get; init; }
        public CustomerKPIs KPIs { get; init; }
        public IReadOnlyList<RevenueTrend> RevenueTrend { get; init; }
    }

    public record Address
    {
        public string Line1 { get; init; }
        public string City { get; init; }
        public string State { get; init; }
        public double? Lat { get; init; }
        public double? Lng { get; init; }
    }

    public record Contact
    {
        public ContactRole Role { get; init; }
        public string Name { get; init; }
        public string? Phone { get; init; }
        public string? Email { get; init; }
    }

    public record CustomerOwner
    {
        public ID RepId { get; init; }
        public string RepName { get; init; }
        public string? Tdm { get; init; }
        public string? Rsm { get; init; }
    }

    public record CreditInfo
    {
        public decimal Limit { get; init; }
        public decimal Exposure { get; init; }
        public CreditAging Aging { get; init; }
        public int DsoDays { get; init; }
        public IReadOnlyList<CreditHold> Holds { get; init; }
    }

    public record CreditAging
    {
        public decimal B0_30 { get; init; }
        public decimal B31_60 { get; init; }
        public decimal B61_90 { get; init; }
        public decimal B90p { get; init; }
    }

    public record CreditHold
    {
        public ID Id { get; init; }
        public string Reason { get; init; }
        public DateTime CreatedAt { get; init; }
        public string By { get; init; }
        public bool Active { get; init; }
    }

    public record CustomerKPIs
    {
        public decimal Last90dRevenue { get; init; }
        public decimal YtdRevenue { get; init; }
        public int OrdersCount90d { get; init; }
        public decimal Aov { get; init; }
        public decimal FillRatePct { get; init; }
        public decimal OnTimePct { get; init; }
        public decimal PriceCompliancePct { get; init; }
        public decimal ReturnRatePct { get; init; }
        public decimal VisitCompliancePct { get; init; }
    }

    public record RevenueTrend
    {
        public string Month { get; init; }
        public decimal Actual { get; init; }
        public decimal? Target { get; init; }
    }
}
```

### Customer Interfaces
```csharp
namespace SalesBackoffice.Domain.Customers
{
    public interface ICustomerService
    {
        Task<PagedResult<CustomerSummary>> GetCustomersAsync(
            int page = 1,
            int pageSize = 20,
            string? search = null,
            string? region = null,
            string? channel = null,
            CustomerStatus? status = null,
            CancellationToken cancellationToken = default);

        Task<Customer?> GetCustomerDetailsAsync(
            ID customerId,
            CancellationToken cancellationToken = default);

        Task<PagedResult<OrderSummary>> GetCustomerOrdersAsync(
            ID customerId,
            int page = 1,
            int pageSize = 20,
            DateTime? from = null,
            DateTime? to = null,
            string? status = null,
            CancellationToken cancellationToken = default);

        Task<PagedResult<Payment>> GetCustomerPaymentsAsync(
            ID customerId,
            int page = 1,
            int pageSize = 20,
            DateTime? from = null,
            DateTime? to = null,
            CancellationToken cancellationToken = default);
    }

    public record CustomerSummary
    {
        public ID Id { get; init; }
        public string Code { get; init; }
        public string Name { get; init; }
        public CustomerStatus Status { get; init; }
        public CustomerChannel Channel { get; init; }
        public string Region { get; init; }
        public decimal Revenue { get; init; }
        public int OrdersCount { get; init; }
    }

    public record OrderSummary
    {
        public ID Id { get; init; }
        public string Number { get; init; }
        public DateTime Date { get; init; }
        public string Status { get; init; }
        public int Cases { get; init; }
        public int Lines { get; init; }
        public decimal Value { get; init; }
        public decimal FillRatePct { get; init; }
        public bool OnTime { get; init; }
    }

    public record Payment
    {
        public ID Id { get; init; }
        public string ReceiptNo { get; init; }
        public DateTime Date { get; init; }
        public string Method { get; init; }
        public string? Provider { get; init; }
        public decimal Amount { get; init; }
        public bool Success { get; init; }
        public string? Reference { get; init; }
        public IReadOnlyList<PaymentApplication> AppliedTo { get; init; }
    }

    public record PaymentApplication
    {
        public string InvoiceNo { get; init; }
        public decimal Amount { get; init; }
    }

    public record PagedResult<T>
    {
        public IReadOnlyList<T> Data { get; init; }
        public PaginationInfo Pagination { get; init; }
    }

    public record PaginationInfo
    {
        public int Page { get; init; }
        public int PageSize { get; init; }
        public int TotalPages { get; init; }
        public int TotalItems { get; init; }
        public bool HasNext { get; init; }
        public bool HasPrevious { get; init; }
    }
}
```

## Orders Domain

### Order Status Types
```csharp
namespace SalesBackoffice.Domain.Orders
{
    public enum OrderStatus
    {
        Draft,
        PendingApproval,
        Confirmed,
        Rejected,
        Cancelled
    }

    public enum FulfillmentStatus
    {
        Unfulfilled,
        PartiallyFulfilled,
        Shipped,
        Delivered,
        Returned
    }

    public enum PaymentStatus
    {
        Unpaid,
        PartiallyPaid,
        Paid,
        Refunded
    }

    public enum UOM
    {
        Cases,
        Units
    }

    public enum OrderEventKind
    {
        Submitted,
        Approved,
        Rejected,
        Confirmed,
        Packed,
        Shipped,
        Delivered,
        Cancelled,
        Returned,
        PaymentReceived
    }
}
```

### Order
```csharp
namespace SalesBackoffice.Domain.Orders
{
    public record Order
    {
        public ID Id { get; init; }
        public string OrderNo { get; init; }
        public ID CustomerId { get; init; }
        public ID SalesRepId { get; init; }
        public ID RegionId { get; init; }
        public ID ChannelId { get; init; }
        public DateTime OrderedAt { get; init; }
        public DateTime? RequiredAt { get; init; }
        public OrderStatus Status { get; init; }
        public FulfillmentStatus FulfillmentStatus { get; init; }
        public PaymentStatus PaymentStatus { get; init; }
        public string Currency { get; init; } = "NGN";
        public decimal SubtotalNgn { get; init; }
        public decimal DiscountNgn { get; init; }
        public decimal TaxNgn { get; init; }
        public decimal ShippingNgn { get; init; }
        public decimal TotalNgn { get; init; }
        public string? Notes { get; init; }
    }

    public record OrderLine
    {
        public ID Id { get; init; }
        public ID OrderId { get; init; }
        public ID SkuId { get; init; }
        public UOM Uom { get; init; }
        public int Qty { get; init; }
        public int QtyFulfilled { get; init; }
        public decimal PriceNgn { get; init; }
        public decimal LineValueNgn { get; init; }
        public decimal? DiscountNgn { get; init; }
    }

    public record OrderEvent
    {
        public ID Id { get; init; }
        public ID OrderId { get; init; }
        public OrderEventKind Kind { get; init; }
        public DateTime At { get; init; }
        public ID? ByUserId { get; init; }
        public string? Note { get; init; }
    }

    public record OrderWithDetails : Order
    {
        public CustomerInfo Customer { get; init; }
        public SalesRepInfo SalesRep { get; init; }
        public IReadOnlyList<OrderLineWithDetails> Lines { get; init; }
        public IReadOnlyList<OrderEvent> Events { get; init; }
    }

    public record CustomerInfo
    {
        public ID Id { get; init; }
        public string Code { get; init; }
        public string Name { get; init; }
        public string Region { get; init; }
        public string Channel { get; init; }
    }

    public record SalesRepInfo
    {
        public ID Id { get; init; }
        public string Name { get; init; }
        public string Role { get; init; }
    }

    public record OrderLineWithDetails : OrderLine
    {
        public SKUInfo Sku { get; init; }
    }

    public record SKUInfo
    {
        public ID Id { get; init; }
        public string Code { get; init; }
        public string Name { get; init; }
        public string Category { get; init; }
    }
}
```

### Order Interfaces
```csharp
namespace SalesBackoffice.Domain.Orders
{
    public interface IOrderService
    {
        Task<PagedResult<Order>> GetOrdersAsync(
            int page = 1,
            int pageSize = 20,
            DateTime? from = null,
            DateTime? to = null,
            string? region = null,
            string? channel = null,
            OrderStatus? status = null,
            FulfillmentStatus? fulfillmentStatus = null,
            PaymentStatus? paymentStatus = null,
            string? customer = null,
            string? salesRep = null,
            CancellationToken cancellationToken = default);

        Task<OrderWithDetails?> GetOrderDetailsAsync(
            ID orderId,
            CancellationToken cancellationToken = default);

        Task<Order> CreateOrderAsync(
            CreateOrderRequest request,
            CancellationToken cancellationToken = default);

        Task<Order> UpdateOrderAsync(
            ID orderId,
            UpdateOrderRequest request,
            CancellationToken cancellationToken = default);

        Task<Order> ApproveOrderAsync(
            ID orderId,
            string? note = null,
            CancellationToken cancellationToken = default);

        Task<Order> RejectOrderAsync(
            ID orderId,
            string? note = null,
            CancellationToken cancellationToken = default);

        Task<OrderKPIs> GetOrderAnalyticsAsync(
            DateTime from,
            DateTime to,
            string? region = null,
            string? channel = null,
            CancellationToken cancellationToken = default);
    }

    public record CreateOrderRequest
    {
        public ID CustomerId { get; init; }
        public DateTime? RequiredAt { get; init; }
        public IReadOnlyList<OrderLineRequest> Lines { get; init; }
        public string? Notes { get; init; }
    }

    public record OrderLineRequest
    {
        public ID SkuId { get; init; }
        public UOM Uom { get; init; }
        public int Qty { get; init; }
        public decimal PriceNgn { get; init; }
    }

    public record UpdateOrderRequest
    {
        public DateTime? RequiredAt { get; init; }
        public IReadOnlyList<OrderLineRequest> Lines { get; init; }
        public string? Notes { get; init; }
    }

    public record OrderKPIs
    {
        public int TotalOrders { get; init; }
        public decimal OrderValue { get; init; }
        public decimal AvgOrderValue { get; init; }
        public int Fulfilled { get; init; }
        public int Pending { get; init; }
        public decimal OnTimeDelivery { get; init; }
        public decimal ReturnsRate { get; init; }
        public Dictionary<string, int> ByStatus { get; init; }
        public Dictionary<string, int> ByFulfillmentStatus { get; init; }
        public Dictionary<string, int> ByPaymentStatus { get; init; }
    }
}
```

## Routes Domain

### Route Types
```csharp
namespace SalesBackoffice.Domain.Routes
{
    public enum RouteStatus
    {
        Active,
        Inactive,
        Draft,
        Completed
    }

    public enum VisitFrequency
    {
        Daily,
        Weekly,
        BiWeekly,
        Monthly
    }

    public enum VisitStatus
    {
        Scheduled,
        InProgress,
        Completed,
        Cancelled,
        Rescheduled
    }
}
```

### Route
```csharp
namespace SalesBackoffice.Domain.Routes
{
    public record SalesRoute
    {
        public ID Id { get; init; }
        public string Name { get; init; }
        public string? Description { get; init; }
        public RouteStatus Status { get; init; }
        public string Territory { get; init; }
        public ID RepId { get; init; }
        public string RepName { get; init; }
        public IReadOnlyList<ID> Customers { get; init; }
        public VisitFrequency VisitFrequency { get; init; }
        public int EstimatedDuration { get; init; }
        public decimal? TotalDistance { get; init; }
        public DateTime? LastOptimized { get; init; }
        public DateTime CreatedAt { get; init; }
        public DateTime UpdatedAt { get; init; }
        public ID CreatedBy { get; init; }
        public RouteMetadata? Metadata { get; init; }
    }

    public record RouteMetadata
    {
        public string Priority { get; init; }
        public IReadOnlyList<string> Tags { get; init; }
        public string? Notes { get; init; }
    }

    public record RouteVisit
    {
        public ID Id { get; init; }
        public ID RouteId { get; init; }
        public ID CustomerId { get; init; }
        public string CustomerName { get; init; }
        public ID RepId { get; init; }
        public string RepName { get; init; }
        public DateTime ScheduledDate { get; init; }
        public string ScheduledTime { get; init; }
        public DateTime? ActualStartTime { get; init; }
        public DateTime? ActualEndTime { get; init; }
        public VisitStatus Status { get; init; }
        public int? Duration { get; init; }
        public decimal? Distance { get; init; }
        public IReadOnlyList<VisitOrder> Orders { get; init; }
        public string? Notes { get; init; }
        public IReadOnlyList<VisitIssue> Issues { get; init; }
        public Location? Location { get; init; }
    }

    public record VisitOrder
    {
        public ID Id { get; init; }
        public decimal Value { get; init; }
        public int Items { get; init; }
    }

    public record VisitIssue
    {
        public string Type { get; init; }
        public string Description { get; init; }
        public bool Resolved { get; init; }
    }

    public record Location
    {
        public double Lat { get; init; }
        public double Lng { get; init; }
        public double? Accuracy { get; init; }
    }

    public record RoutePerformance
    {
        public ID RouteId { get; init; }
        public string Period { get; init; }
        public int TotalVisits { get; init; }
        public int CompletedVisits { get; init; }
        public decimal CompletionRate { get; init; }
        public int TotalOrders { get; init; }
        public decimal TotalValue { get; init; }
        public decimal AverageVisitDuration { get; init; }
        public decimal TotalDistance { get; init; }
        public decimal OnTimeRate { get; init; }
        public decimal? CustomerSatisfaction { get; init; }
    }

    public record RouteOptimization
    {
        public ID RouteId { get; init; }
        public DateTime OptimizedAt { get; init; }
        public decimal OriginalDistance { get; init; }
        public decimal OptimizedDistance { get; init; }
        public decimal Savings { get; init; }
        public IReadOnlyList<ID> NewSequence { get; init; }
        public int EstimatedTimeSavings { get; init; }
    }
}
```

### Route Interfaces
```csharp
namespace SalesBackoffice.Domain.Routes
{
    public interface IRouteService
    {
        Task<PagedResult<SalesRoute>> GetRoutesAsync(
            int page = 1,
            int pageSize = 20,
            RouteStatus? status = null,
            string? territory = null,
            ID? repId = null,
            CancellationToken cancellationToken = default);

        Task<RouteWithDetails?> GetRouteDetailsAsync(
            ID routeId,
            CancellationToken cancellationToken = default);

        Task<SalesRoute> CreateRouteAsync(
            CreateRouteRequest request,
            CancellationToken cancellationToken = default);

        Task<SalesRoute> UpdateRouteAsync(
            ID routeId,
            UpdateRouteRequest request,
            CancellationToken cancellationToken = default);

        Task<RouteOptimization> OptimizeRouteAsync(
            ID routeId,
            CancellationToken cancellationToken = default);

        Task<RouteAnalytics> GetRouteAnalyticsAsync(
            DateTime? from = null,
            DateTime? to = null,
            string? region = null,
            CancellationToken cancellationToken = default);
    }

    public record CreateRouteRequest
    {
        public string Name { get; init; }
        public string? Description { get; init; }
        public string Territory { get; init; }
        public ID RepId { get; init; }
        public IReadOnlyList<ID> Customers { get; init; }
        public VisitFrequency VisitFrequency { get; init; }
        public int EstimatedDuration { get; init; }
    }

    public record UpdateRouteRequest
    {
        public string? Name { get; init; }
        public string? Description { get; init; }
        public IReadOnlyList<ID>? Customers { get; init; }
        public VisitFrequency? VisitFrequency { get; init; }
        public int? EstimatedDuration { get; init; }
    }

    public record RouteWithDetails : SalesRoute
    {
        public IReadOnlyList<CustomerLocation> CustomerDetails { get; init; }
        public IReadOnlyList<RouteVisit> Visits { get; init; }
        public RoutePerformance? Performance { get; init; }
    }

    public record CustomerLocation
    {
        public ID Id { get; init; }
        public string Code { get; init; }
        public string Name { get; init; }
        public Address Address { get; init; }
    }

    public record RouteAnalytics
    {
        public int TotalRoutes { get; init; }
        public int ActiveRoutes { get; init; }
        public int TotalCustomers { get; init; }
        public decimal AverageCompletionRate { get; init; }
        public decimal TotalDistance { get; init; }
        public int TotalVisitsToday { get; init; }
        public int CompletedVisitsToday { get; init; }
        public int PendingIssues { get; init; }
        public IReadOnlyList<TerritoryCoverage> TerritoryCoverage { get; init; }
        public IReadOnlyList<RepPerformance> RepPerformance { get; init; }
    }

    public record TerritoryCoverage
    {
        public string Territory { get; init; }
        public int Routes { get; init; }
        public int Customers { get; init; }
        public decimal CompletionRate { get; init; }
    }

    public record RepPerformance
    {
        public ID RepId { get; init; }
        public string RepName { get; init; }
        public int Routes { get; init; }
        public decimal CompletionRate { get; init; }
        public int TotalVisits { get; init; }
        public int TotalOrders { get; init; }
    }
}
```

## Targets Domain

### Target Types
```csharp
namespace SalesBackoffice.Domain.Targets
{
    public enum BatchStatus
    {
        Draft,
        Submitted,
        Approved,
        Rejected
    }

    public enum TargetUOM
    {
        Cases,
        Units,
        Litres,
        Value
    }
}
```

### Target
```csharp
namespace SalesBackoffice.Domain.Targets
{
    public record TargetBatch
    {
        public ID Id { get; init; }
        public ID PeriodId { get; init; }
        public ID? RegionId { get; init; }
        public ID? OwnerUserId { get; init; }
        public BatchStatus Status { get; init; }
        public string? Note { get; init; }
        public ID CreatedBy { get; init; }
        public DateTime CreatedAt { get; init; }
    }

    public record TargetRow
    {
        public ID Id { get; init; }
        public ID BatchId { get; init; }
        public ID PeriodId { get; init; }
        public ID CustomerId { get; init; }
        public ID SkuId { get; init; }
        public ID? OwnerUserId { get; init; }
        public TargetUOM Uom { get; init; }
        public decimal TargetQty { get; init; }
        public decimal? TargetValueNgn { get; init; }
    }

    public record TargetBatchWithDetails : TargetBatch
    {
        public Period Period { get; init; }
        public Region? Region { get; init; }
        public User? Owner { get; init; }
        public IReadOnlyList<TargetRowWithDetails> Rows { get; init; }
    }

    public record TargetRowWithDetails : TargetRow
    {
        public CustomerWithDetails Customer { get; init; }
        public SKU Sku { get; init; }
        public User? Owner { get; init; }
    }

    public record CustomerWithDetails
    {
        public ID Id { get; init; }
        public string Code { get; init; }
        public string Name { get; init; }
        public ID RegionId { get; init; }
        public ID ChannelId { get; init; }
        public ID DealerTypeId { get; init; }
        public ID? AssignedRepId { get; init; }
        public Region Region { get; init; }
        public Channel Channel { get; init; }
        public DealerType DealerType { get; init; }
        public User? AssignedRep { get; init; }
    }

    public record DealerType
    {
        public ID Id { get; init; }
        public string Name { get; init; }
    }
}
```

### Target Interfaces
```csharp
namespace SalesBackoffice.Domain.Targets
{
    public interface ITargetService
    {
        Task<PagedResult<TargetBatch>> GetTargetsAsync(
            int page = 1,
            int pageSize = 20,
            ID? periodId = null,
            ID? regionId = null,
            BatchStatus? status = null,
            CancellationToken cancellationToken = default);

        Task<TargetBatchWithDetails?> GetTargetDetailsAsync(
            ID targetId,
            CancellationToken cancellationToken = default);

        Task<TargetBatch> CreateTargetBatchAsync(
            CreateTargetBatchRequest request,
            CancellationToken cancellationToken = default);

        Task<TargetBatch> UpdateTargetBatchAsync(
            ID targetId,
            UpdateTargetBatchRequest request,
            CancellationToken cancellationToken = default);

        Task<TargetBatch> SubmitTargetBatchAsync(
            ID targetId,
            CancellationToken cancellationToken = default);

        Task<TargetBatch> ApproveTargetBatchAsync(
            ID targetId,
            string? note = null,
            CancellationToken cancellationToken = default);

        Task<TargetBatch> RejectTargetBatchAsync(
            ID targetId,
            string? note = null,
            CancellationToken cancellationToken = default);
    }

    public record CreateTargetBatchRequest
    {
        public ID PeriodId { get; init; }
        public ID? RegionId { get; init; }
        public string? Note { get; init; }
        public IReadOnlyList<TargetRowRequest> Rows { get; init; }
    }

    public record TargetRowRequest
    {
        public ID CustomerId { get; init; }
        public ID SkuId { get; init; }
        public ID? OwnerUserId { get; init; }
        public TargetUOM Uom { get; init; }
        public decimal TargetQty { get; init; }
    }

    public record UpdateTargetBatchRequest
    {
        public string? Note { get; init; }
        public IReadOnlyList<TargetRowRequest>? Rows { get; init; }
    }
}
```

## Marketing Domain

### Marketing Interfaces
```csharp
namespace SalesBackoffice.Domain.Marketing
{
    public interface IMarketingService
    {
        Task<PagedResult<Campaign>> GetCampaignsAsync(
            int page = 1,
            int pageSize = 20,
            string? status = null,
            CancellationToken cancellationToken = default);

        Task<PagedResult<Promotion>> GetPromotionsAsync(
            int page = 1,
            int pageSize = 20,
            string? status = null,
            CancellationToken cancellationToken = default);
    }

    public record Campaign
    {
        public ID Id { get; init; }
        public string Name { get; init; }
        public string? Description { get; init; }
        public DateTime StartDate { get; init; }
        public DateTime EndDate { get; init; }
        public string Status { get; init; }
        public decimal Budget { get; init; }
        public decimal Spent { get; init; }
    }

    public record Promotion
    {
        public ID Id { get; init; }
        public string Name { get; init; }
        public string? Description { get; init; }
        public DateTime StartDate { get; init; }
        public DateTime EndDate { get; init; }
        public string Status { get; init; }
        public decimal Discount { get; init; }
    }
}
```

## Resources Domain

### Resource Types
```csharp
namespace SalesBackoffice.Domain.Resources
{
    public enum ResourceType
    {
        Pdf,
        Doc,
        Excel,
        Video,
        Link,
        Faq
    }

    public enum ResourceStatus
    {
        Active,
        Archived
    }
}
```

### Resource Interfaces
```csharp
namespace SalesBackoffice.Domain.Resources
{
    public interface IResourceService
    {
        Task<PagedResult<ResourceWithDetails>> GetResourcesAsync(
            int page = 1,
            int pageSize = 20,
            string? search = null,
            string? category = null,
            ResourceType? type = null,
            IReadOnlyList<string>? tags = null,
            CancellationToken cancellationToken = default);

        Task<ResourceWithDetails> UploadResourceAsync(
            UploadResourceRequest request,
            CancellationToken cancellationToken = default);
    }

    public record Resource
    {
        public ID Id { get; init; }
        public string Title { get; init; }
        public string? Description { get; init; }
        public ResourceType Type { get; init; }
        public ID CategoryId { get; init; }
        public IReadOnlyList<string> Tags { get; init; }
        public string Url { get; init; }
        public ID UploadedBy { get; init; }
        public DateTime UploadedAt { get; init; }
        public DateTime? UpdatedAt { get; init; }
        public string? Version { get; init; }
        public ResourceStatus Status { get; init; }
        public IReadOnlyList<string> VisibilityRoles { get; init; }
    }

    public record ResourceCategory
    {
        public ID Id { get; init; }
        public string Name { get; init; }
        public string? Description { get; init; }
    }

    public record ResourceWithDetails : Resource
    {
        public ResourceCategory Category { get; init; }
        public UserInfo UploadedBy { get; init; }
        public bool? IsFavorited { get; init; }
        public int? DownloadCount { get; init; }
        public DateTime? LastViewed { get; init; }
    }

    public record UserInfo
    {
        public ID Id { get; init; }
        public string Name { get; init; }
        public string Role { get; init; }
    }

    public record UploadResourceRequest
    {
        public Stream FileStream { get; init; }
        public string FileName { get; init; }
        public string Title { get; init; }
        public string? Description { get; init; }
        public ResourceType Type { get; init; }
        public ID CategoryId { get; init; }
        public IReadOnlyList<string> Tags { get; init; }
        public IReadOnlyList<string> VisibilityRoles { get; init; }
    }
}
```

## Repository Interfaces

### Generic Repository
```csharp
namespace SalesBackoffice.Domain.Common
{
    public interface IRepository<T> where T : class
    {
        Task<T?> GetByIdAsync(ID id, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<T>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<T> AddAsync(T entity, CancellationToken cancellationToken = default);
        Task<T> UpdateAsync(T entity, CancellationToken cancellationToken = default);
        Task DeleteAsync(ID id, CancellationToken cancellationToken = default);
    }

    public interface IPagedRepository<T> : IRepository<T> where T : class
    {
        Task<PagedResult<T>> GetPagedAsync(
            int page = 1,
            int pageSize = 20,
            CancellationToken cancellationToken = default);
    }
}
```

### Unit of Work
```csharp
namespace SalesBackoffice.Domain.Common
{
    public interface IUnitOfWork : IDisposable
    {
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
        Task BeginTransactionAsync(CancellationToken cancellationToken = default);
        Task CommitTransactionAsync(CancellationToken cancellationToken = default);
        Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
    }
}
```

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-27  
**Author**: Development Team

