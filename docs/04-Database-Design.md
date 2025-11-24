# Database Design & Implementation Guide

## Overview

This document describes the database schema design and implementation guide for the Sales Backoffice application. The database is designed to support all business operations including sales management, customer relationships, order processing, payment tracking, route management, and target setting.

## Database Technology

- **Database System**: SQL Server / PostgreSQL (recommended: PostgreSQL for better JSON support)
- **ORM**: Entity Framework Core (EF Core)
- **Migration Strategy**: Code-First with EF Core Migrations

## Database Schema

### Entity Relationship Diagram (ERD)

```
Users ──┬── Orders
        ├── Routes
        ├── TargetBatches
        └── Resources

Customers ──┬── Orders
           ├── Payments
           ├── RouteVisits
           └── TargetRows

Orders ──┬── OrderLines
         └── OrderEvents

Routes ──┬── RouteVisits
         └── RoutePerformance

TargetBatches ── TargetRows

SKUs ──┬── OrderLines
       └── TargetRows

Regions ──┬── Customers
          ├── Routes
          └── TargetBatches

Channels ── Customers
```

## Core Tables

### 1. Users Table

**Purpose**: Stores user accounts and authentication information

```sql
CREATE TABLE Users (
    Id VARCHAR(50) PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    Email NVARCHAR(200) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(500) NOT NULL,
    Role VARCHAR(50) NOT NULL, -- Executive, GTM, Sales, Admin, RSM, TDM, TDE, SalesRep
    RegionId VARCHAR(50) NULL,
    ManagerId VARCHAR(50) NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    LastLoginAt DATETIME2 NULL,
    
    CONSTRAINT FK_Users_Region FOREIGN KEY (RegionId) REFERENCES Regions(Id),
    CONSTRAINT FK_Users_Manager FOREIGN KEY (ManagerId) REFERENCES Users(Id),
    CONSTRAINT CHK_Users_Role CHECK (Role IN ('Executive', 'GTM', 'Sales', 'Admin', 'RSM', 'TDM', 'TDE', 'SalesRep'))
);

CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Users_Role ON Users(Role);
CREATE INDEX IX_Users_RegionId ON Users(RegionId);
CREATE INDEX IX_Users_ManagerId ON Users(ManagerId);
```

### 2. Regions Table

**Purpose**: Stores regional information

```sql
CREATE TABLE Regions (
    Id VARCHAR(50) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL UNIQUE,
    State NVARCHAR(100) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- Seed data
INSERT INTO Regions (Id, Name, State) VALUES
('reg1', 'Abuja', 'FCT'),
('reg2', 'Kano', 'Kano'),
('reg3', 'Kaduna', 'Kaduna'),
('reg4', 'Aba', 'Abia'),
('reg5', 'Enugu', 'Enugu'),
('reg6', 'Benin', 'Edo'),
('reg7', 'Ibadan', 'Oyo'),
('reg8', 'Ilorin', 'Kwara'),
('reg9', 'Ikeja', 'Lagos');
```

### 3. Channels Table

**Purpose**: Stores sales channel information

```sql
CREATE TABLE Channels (
    Id VARCHAR(50) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL UNIQUE,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- Seed data
INSERT INTO Channels (Id, Name) VALUES
('ch1', 'Modern Trade'),
('ch2', 'General Trade'),
('ch3', 'HORECA'),
('ch4', 'E-Commerce');
```

### 4. DealerTypes Table

**Purpose**: Stores dealer type classifications

```sql
CREATE TABLE DealerTypes (
    Id VARCHAR(50) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL UNIQUE,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- Seed data
INSERT INTO DealerTypes (Id, Name) VALUES
('dt1', 'Key Distributor'),
('dt2', 'Wholesaler'),
('dt3', 'Retailer'),
('dt4', 'Other');
```

### 5. Customers Table

**Purpose**: Stores customer/dealer information

```sql
CREATE TABLE Customers (
    Id VARCHAR(50) PRIMARY KEY,
    Code NVARCHAR(50) NOT NULL UNIQUE,
    Name NVARCHAR(200) NOT NULL,
    Status VARCHAR(20) NOT NULL DEFAULT 'Active', -- Active, OnHold, Inactive
    ChannelId VARCHAR(50) NOT NULL,
    Segment NVARCHAR(100) NULL,
    RegionId VARCHAR(50) NOT NULL,
    RouteId VARCHAR(50) NULL,
    DealerTypeId VARCHAR(50) NOT NULL,
    AssignedRepId VARCHAR(50) NULL,
    
    -- Address
    AddressLine1 NVARCHAR(200) NOT NULL,
    AddressCity NVARCHAR(100) NOT NULL,
    AddressState NVARCHAR(100) NOT NULL,
    AddressLat DECIMAL(10, 8) NULL,
    AddressLng DECIMAL(11, 8) NULL,
    
    -- Payment Terms
    PaymentTerms VARCHAR(20) NOT NULL DEFAULT 'Net30', -- Prepaid, COD, Net7, Net14, Net30
    PriceTier NVARCHAR(50) NULL,
    
    -- Credit Information
    CreditLimit DECIMAL(18, 2) NOT NULL DEFAULT 0,
    CreditExposure DECIMAL(18, 2) NOT NULL DEFAULT 0,
    DsoDays INT NOT NULL DEFAULT 0,
    
    -- Metadata
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    CreatedBy VARCHAR(50) NOT NULL,
    
    CONSTRAINT FK_Customers_Channel FOREIGN KEY (ChannelId) REFERENCES Channels(Id),
    CONSTRAINT FK_Customers_Region FOREIGN KEY (RegionId) REFERENCES Regions(Id),
    CONSTRAINT FK_Customers_Route FOREIGN KEY (RouteId) REFERENCES Routes(Id),
    CONSTRAINT FK_Customers_DealerType FOREIGN KEY (DealerTypeId) REFERENCES DealerTypes(Id),
    CONSTRAINT FK_Customers_AssignedRep FOREIGN KEY (AssignedRepId) REFERENCES Users(Id),
    CONSTRAINT CHK_Customers_Status CHECK (Status IN ('Active', 'OnHold', 'Inactive')),
    CONSTRAINT CHK_Customers_PaymentTerms CHECK (PaymentTerms IN ('Prepaid', 'COD', 'Net7', 'Net14', 'Net30'))
);

CREATE INDEX IX_Customers_Code ON Customers(Code);
CREATE INDEX IX_Customers_RegionId ON Customers(RegionId);
CREATE INDEX IX_Customers_ChannelId ON Customers(ChannelId);
CREATE INDEX IX_Customers_AssignedRepId ON Customers(AssignedRepId);
CREATE INDEX IX_Customers_Status ON Customers(Status);
```

### 6. CustomerContacts Table

**Purpose**: Stores customer contact information

```sql
CREATE TABLE CustomerContacts (
    Id VARCHAR(50) PRIMARY KEY,
    CustomerId VARCHAR(50) NOT NULL,
    Role VARCHAR(20) NOT NULL, -- Primary, Finance, Receiving
    Name NVARCHAR(200) NOT NULL,
    Phone NVARCHAR(50) NULL,
    Email NVARCHAR(200) NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    CONSTRAINT FK_CustomerContacts_Customer FOREIGN KEY (CustomerId) REFERENCES Customers(Id) ON DELETE CASCADE,
    CONSTRAINT CHK_CustomerContacts_Role CHECK (Role IN ('Primary', 'Finance', 'Receiving'))
);

CREATE INDEX IX_CustomerContacts_CustomerId ON CustomerContacts(CustomerId);
```

### 7. CreditAging Table

**Purpose**: Stores customer credit aging information

```sql
CREATE TABLE CreditAging (
    Id VARCHAR(50) PRIMARY KEY,
    CustomerId VARCHAR(50) NOT NULL,
    B0_30 DECIMAL(18, 2) NOT NULL DEFAULT 0,
    B31_60 DECIMAL(18, 2) NOT NULL DEFAULT 0,
    B61_90 DECIMAL(18, 2) NOT NULL DEFAULT 0,
    B90p DECIMAL(18, 2) NOT NULL DEFAULT 0,
    CalculatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    CONSTRAINT FK_CreditAging_Customer FOREIGN KEY (CustomerId) REFERENCES Customers(Id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IX_CreditAging_CustomerId ON CreditAging(CustomerId);
```

### 8. CreditHolds Table

**Purpose**: Stores customer credit hold information

```sql
CREATE TABLE CreditHolds (
    Id VARCHAR(50) PRIMARY KEY,
    CustomerId VARCHAR(50) NOT NULL,
    Reason NVARCHAR(500) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CreatedBy VARCHAR(50) NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    ResolvedAt DATETIME2 NULL,
    ResolvedBy VARCHAR(50) NULL,
    
    CONSTRAINT FK_CreditHolds_Customer FOREIGN KEY (CustomerId) REFERENCES Customers(Id) ON DELETE CASCADE,
    CONSTRAINT FK_CreditHolds_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES Users(Id),
    CONSTRAINT FK_CreditHolds_ResolvedBy FOREIGN KEY (ResolvedBy) REFERENCES Users(Id)
);

CREATE INDEX IX_CreditHolds_CustomerId ON CreditHolds(CustomerId);
CREATE INDEX IX_CreditHolds_IsActive ON CreditHolds(IsActive);
```

### 9. SKUs Table

**Purpose**: Stores product/SKU information

```sql
CREATE TABLE SKUs (
    Id VARCHAR(50) PRIMARY KEY,
    Code NVARCHAR(50) NOT NULL UNIQUE,
    Name NVARCHAR(200) NOT NULL,
    Brand VARCHAR(50) NOT NULL, -- Pepsi, Mirinda, Teem, Aquafina, LiptonIceTea, SupaKomando, Rockstar
    Category VARCHAR(20) NOT NULL, -- RGB, PET, Water, Energy
    SizeMl INT NOT NULL,
    PackType NVARCHAR(50) NOT NULL, -- Bottle (PET RB), Bottle (Glass NRB), Can
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    
    CONSTRAINT CHK_SKUs_Brand CHECK (Brand IN ('Pepsi', 'Mirinda', 'Teem', 'Aquafina', 'LiptonIceTea', 'SupaKomando', 'Rockstar')),
    CONSTRAINT CHK_SKUs_Category CHECK (Category IN ('RGB', 'PET', 'Water', 'Energy'))
);

CREATE INDEX IX_SKUs_Code ON SKUs(Code);
CREATE INDEX IX_SKUs_Brand ON SKUs(Brand);
CREATE INDEX IX_SKUs_Category ON SKUs(Category);
```

### 10. Orders Table

**Purpose**: Stores order information

```sql
CREATE TABLE Orders (
    Id VARCHAR(50) PRIMARY KEY,
    OrderNo NVARCHAR(50) NOT NULL UNIQUE,
    CustomerId VARCHAR(50) NOT NULL,
    SalesRepId VARCHAR(50) NOT NULL,
    RegionId VARCHAR(50) NOT NULL,
    ChannelId VARCHAR(50) NOT NULL,
    OrderedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    RequiredAt DATETIME2 NULL,
    
    -- Status
    Status VARCHAR(20) NOT NULL DEFAULT 'draft', -- draft, pending_approval, confirmed, rejected, cancelled
    FulfillmentStatus VARCHAR(20) NOT NULL DEFAULT 'unfulfilled', -- unfulfilled, partially_fulfilled, shipped, delivered, returned
    PaymentStatus VARCHAR(20) NOT NULL DEFAULT 'unpaid', -- unpaid, partially_paid, paid, refunded
    
    -- Financial
    Currency VARCHAR(3) NOT NULL DEFAULT 'NGN',
    SubtotalNgn DECIMAL(18, 2) NOT NULL DEFAULT 0,
    DiscountNgn DECIMAL(18, 2) NOT NULL DEFAULT 0,
    TaxNgn DECIMAL(18, 2) NOT NULL DEFAULT 0,
    ShippingNgn DECIMAL(18, 2) NOT NULL DEFAULT 0,
    TotalNgn DECIMAL(18, 2) NOT NULL DEFAULT 0,
    
    -- Metadata
    Notes NVARCHAR(1000) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    
    CONSTRAINT FK_Orders_Customer FOREIGN KEY (CustomerId) REFERENCES Customers(Id),
    CONSTRAINT FK_Orders_SalesRep FOREIGN KEY (SalesRepId) REFERENCES Users(Id),
    CONSTRAINT FK_Orders_Region FOREIGN KEY (RegionId) REFERENCES Regions(Id),
    CONSTRAINT FK_Orders_Channel FOREIGN KEY (ChannelId) REFERENCES Channels(Id),
    CONSTRAINT CHK_Orders_Status CHECK (Status IN ('draft', 'pending_approval', 'confirmed', 'rejected', 'cancelled')),
    CONSTRAINT CHK_Orders_FulfillmentStatus CHECK (FulfillmentStatus IN ('unfulfilled', 'partially_fulfilled', 'shipped', 'delivered', 'returned')),
    CONSTRAINT CHK_Orders_PaymentStatus CHECK (PaymentStatus IN ('unpaid', 'partially_paid', 'paid', 'refunded'))
);

CREATE INDEX IX_Orders_OrderNo ON Orders(OrderNo);
CREATE INDEX IX_Orders_CustomerId ON Orders(CustomerId);
CREATE INDEX IX_Orders_SalesRepId ON Orders(SalesRepId);
CREATE INDEX IX_Orders_RegionId ON Orders(RegionId);
CREATE INDEX IX_Orders_Status ON Orders(Status);
CREATE INDEX IX_Orders_OrderedAt ON Orders(OrderedAt);
```

### 11. OrderLines Table

**Purpose**: Stores order line items

```sql
CREATE TABLE OrderLines (
    Id VARCHAR(50) PRIMARY KEY,
    OrderId VARCHAR(50) NOT NULL,
    SkuId VARCHAR(50) NOT NULL,
    Uom VARCHAR(10) NOT NULL, -- cases, units
    Qty INT NOT NULL,
    QtyFulfilled INT NOT NULL DEFAULT 0,
    PriceNgn DECIMAL(18, 2) NOT NULL,
    LineValueNgn DECIMAL(18, 2) NOT NULL,
    DiscountNgn DECIMAL(18, 2) NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    CONSTRAINT FK_OrderLines_Order FOREIGN KEY (OrderId) REFERENCES Orders(Id) ON DELETE CASCADE,
    CONSTRAINT FK_OrderLines_SKU FOREIGN KEY (SkuId) REFERENCES SKUs(Id),
    CONSTRAINT CHK_OrderLines_Uom CHECK (Uom IN ('cases', 'units'))
);

CREATE INDEX IX_OrderLines_OrderId ON OrderLines(OrderId);
CREATE INDEX IX_OrderLines_SkuId ON OrderLines(SkuId);
```

### 12. OrderEvents Table

**Purpose**: Stores order event history

```sql
CREATE TABLE OrderEvents (
    Id VARCHAR(50) PRIMARY KEY,
    OrderId VARCHAR(50) NOT NULL,
    Kind VARCHAR(50) NOT NULL, -- submitted, approved, rejected, confirmed, packed, shipped, delivered, cancelled, returned, payment_received
    At DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ByUserId VARCHAR(50) NULL,
    Note NVARCHAR(500) NULL,
    
    CONSTRAINT FK_OrderEvents_Order FOREIGN KEY (OrderId) REFERENCES Orders(Id) ON DELETE CASCADE,
    CONSTRAINT FK_OrderEvents_ByUser FOREIGN KEY (ByUserId) REFERENCES Users(Id)
);

CREATE INDEX IX_OrderEvents_OrderId ON OrderEvents(OrderId);
CREATE INDEX IX_OrderEvents_At ON OrderEvents(At);
```

### 13. Routes Table

**Purpose**: Stores route information

```sql
CREATE TABLE Routes (
    Id VARCHAR(50) PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(500) NULL,
    Status VARCHAR(20) NOT NULL DEFAULT 'draft', -- active, inactive, draft, completed
    Territory NVARCHAR(100) NOT NULL,
    RepId VARCHAR(50) NOT NULL,
    VisitFrequency VARCHAR(20) NOT NULL, -- daily, weekly, bi-weekly, monthly
    EstimatedDuration INT NOT NULL, -- in minutes
    TotalDistance DECIMAL(10, 2) NULL, -- in km
    LastOptimized DATETIME2 NULL,
    Priority VARCHAR(10) NULL, -- high, medium, low
    Tags NVARCHAR(500) NULL, -- JSON array
    Notes NVARCHAR(1000) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    CreatedBy VARCHAR(50) NOT NULL,
    
    CONSTRAINT FK_Routes_Rep FOREIGN KEY (RepId) REFERENCES Users(Id),
    CONSTRAINT FK_Routes_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES Users(Id),
    CONSTRAINT CHK_Routes_Status CHECK (Status IN ('active', 'inactive', 'draft', 'completed')),
    CONSTRAINT CHK_Routes_VisitFrequency CHECK (VisitFrequency IN ('daily', 'weekly', 'bi-weekly', 'monthly'))
);

CREATE INDEX IX_Routes_RepId ON Routes(RepId);
CREATE INDEX IX_Routes_Status ON Routes(Status);
CREATE INDEX IX_Routes_Territory ON Routes(Territory);
```

### 14. RouteCustomers Table

**Purpose**: Stores route-customer assignments (many-to-many)

```sql
CREATE TABLE RouteCustomers (
    Id VARCHAR(50) PRIMARY KEY,
    RouteId VARCHAR(50) NOT NULL,
    CustomerId VARCHAR(50) NOT NULL,
    SequenceOrder INT NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    CONSTRAINT FK_RouteCustomers_Route FOREIGN KEY (RouteId) REFERENCES Routes(Id) ON DELETE CASCADE,
    CONSTRAINT FK_RouteCustomers_Customer FOREIGN KEY (CustomerId) REFERENCES Customers(Id) ON DELETE CASCADE,
    CONSTRAINT UQ_RouteCustomers_RouteCustomer UNIQUE (RouteId, CustomerId)
);

CREATE INDEX IX_RouteCustomers_RouteId ON RouteCustomers(RouteId);
CREATE INDEX IX_RouteCustomers_CustomerId ON RouteCustomers(CustomerId);
```

### 15. RouteVisits Table

**Purpose**: Stores route visit information

```sql
CREATE TABLE RouteVisits (
    Id VARCHAR(50) PRIMARY KEY,
    RouteId VARCHAR(50) NOT NULL,
    CustomerId VARCHAR(50) NOT NULL,
    RepId VARCHAR(50) NOT NULL,
    ScheduledDate DATE NOT NULL,
    ScheduledTime TIME NOT NULL,
    ActualStartTime DATETIME2 NULL,
    ActualEndTime DATETIME2 NULL,
    Status VARCHAR(20) NOT NULL DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled, rescheduled
    Duration INT NULL, -- actual duration in minutes
    Distance DECIMAL(10, 2) NULL, -- distance from previous visit in km
    Notes NVARCHAR(1000) NULL,
    LocationLat DECIMAL(10, 8) NULL,
    LocationLng DECIMAL(11, 8) NULL,
    LocationAccuracy DECIMAL(10, 2) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    
    CONSTRAINT FK_RouteVisits_Route FOREIGN KEY (RouteId) REFERENCES Routes(Id) ON DELETE CASCADE,
    CONSTRAINT FK_RouteVisits_Customer FOREIGN KEY (CustomerId) REFERENCES Customers(Id),
    CONSTRAINT FK_RouteVisits_Rep FOREIGN KEY (RepId) REFERENCES Users(Id),
    CONSTRAINT CHK_RouteVisits_Status CHECK (Status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled'))
);

CREATE INDEX IX_RouteVisits_RouteId ON RouteVisits(RouteId);
CREATE INDEX IX_RouteVisits_CustomerId ON RouteVisits(CustomerId);
CREATE INDEX IX_RouteVisits_RepId ON RouteVisits(RepId);
CREATE INDEX IX_RouteVisits_ScheduledDate ON RouteVisits(ScheduledDate);
CREATE INDEX IX_RouteVisits_Status ON RouteVisits(Status);
```

### 16. VisitIssues Table

**Purpose**: Stores visit issues

```sql
CREATE TABLE VisitIssues (
    Id VARCHAR(50) PRIMARY KEY,
    VisitId VARCHAR(50) NOT NULL,
    Type VARCHAR(20) NOT NULL, -- delivery, payment, inventory, other
    Description NVARCHAR(500) NOT NULL,
    IsResolved BIT NOT NULL DEFAULT 0,
    ResolvedAt DATETIME2 NULL,
    ResolvedBy VARCHAR(50) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    CONSTRAINT FK_VisitIssues_Visit FOREIGN KEY (VisitId) REFERENCES RouteVisits(Id) ON DELETE CASCADE,
    CONSTRAINT FK_VisitIssues_ResolvedBy FOREIGN KEY (ResolvedBy) REFERENCES Users(Id),
    CONSTRAINT CHK_VisitIssues_Type CHECK (Type IN ('delivery', 'payment', 'inventory', 'other'))
);

CREATE INDEX IX_VisitIssues_VisitId ON VisitIssues(VisitId);
CREATE INDEX IX_VisitIssues_IsResolved ON VisitIssues(IsResolved);
```

### 17. Payments Table

**Purpose**: Stores payment transaction information

```sql
CREATE TABLE Payments (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Token NVARCHAR(200) NULL,
    Amount DECIMAL(18, 2) NOT NULL,
    CustomerId VARCHAR(50) NOT NULL,
    Email NVARCHAR(200) NULL,
    OrderId VARCHAR(50) NULL,
    SecurityCode NVARCHAR(50) NULL,
    CollectionBankAccount NVARCHAR(100) NULL,
    CollectionBankCode NVARCHAR(50) NULL,
    SourceBankCode NVARCHAR(50) NULL,
    CustomerAccountNumber NVARCHAR(50) NULL,
    TransactionReference NVARCHAR(100) NOT NULL UNIQUE,
    PaymentStatus VARCHAR(20) NOT NULL, -- Successful, Failed, Pending
    Narration NVARCHAR(500) NOT NULL,
    CustomerName NVARCHAR(200) NOT NULL,
    PaidAmount DECIMAL(18, 2) NOT NULL,
    CustomerFee DECIMAL(18, 2) NOT NULL DEFAULT 0,
    MerchantFee DECIMAL(18, 2) NOT NULL DEFAULT 0,
    VendorTransactionRef NVARCHAR(100) NOT NULL,
    PaymentProvider VARCHAR(50) NOT NULL, -- ABVA, ZBVA, GBVA, GTB, Paystack, Flutterwave, Interswitch
    ApplicationId INT NOT NULL,
    PaymentDate DATETIME2 NOT NULL,
    TellerNo NVARCHAR(50) NULL,
    TellerCreated DATETIME2 NULL,
    BankAccountCode NVARCHAR(50) NOT NULL,
    BankName NVARCHAR(200) NOT NULL,
    BankDescription NVARCHAR(500) NULL,
    InvoiceCreated BIT NOT NULL DEFAULT 0,
    InvoiceNumber NVARCHAR(50) NULL,
    Processed BIT NOT NULL DEFAULT 0,
    ProcessedDate DATETIME2 NULL,
    NavisionProcessed BIT NOT NULL DEFAULT 0,
    NotificationReceived BIT NOT NULL DEFAULT 0,
    Logo NVARCHAR(500) NULL,
    PaymentType INT NOT NULL, -- 1 = Direct, 2 = Virtual Account
    RegionCode NVARCHAR(50) NOT NULL,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    CONSTRAINT FK_Payments_Customer FOREIGN KEY (CustomerId) REFERENCES Customers(Id),
    CONSTRAINT FK_Payments_Order FOREIGN KEY (OrderId) REFERENCES Orders(Id),
    CONSTRAINT CHK_Payments_PaymentStatus CHECK (PaymentStatus IN ('Successful', 'Failed', 'Pending')),
    CONSTRAINT CHK_Payments_PaymentType CHECK (PaymentType IN (1, 2))
);

CREATE INDEX IX_Payments_CustomerId ON Payments(CustomerId);
CREATE INDEX IX_Payments_OrderId ON Payments(OrderId);
CREATE INDEX IX_Payments_TransactionReference ON Payments(TransactionReference);
CREATE INDEX IX_Payments_PaymentStatus ON Payments(PaymentStatus);
CREATE INDEX IX_Payments_PaymentDate ON Payments(PaymentDate);
CREATE INDEX IX_Payments_RegionCode ON Payments(RegionCode);
```

### 18. PaymentApplications Table

**Purpose**: Stores payment-to-invoice applications

```sql
CREATE TABLE PaymentApplications (
    Id VARCHAR(50) PRIMARY KEY,
    PaymentId INT NOT NULL,
    InvoiceNumber NVARCHAR(50) NOT NULL,
    Amount DECIMAL(18, 2) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    CONSTRAINT FK_PaymentApplications_Payment FOREIGN KEY (PaymentId) REFERENCES Payments(Id) ON DELETE CASCADE
);

CREATE INDEX IX_PaymentApplications_PaymentId ON PaymentApplications(PaymentId);
CREATE INDEX IX_PaymentApplications_InvoiceNumber ON PaymentApplications(InvoiceNumber);
```

### 19. Periods Table

**Purpose**: Stores time periods for targets

```sql
CREATE TABLE Periods (
    Id VARCHAR(50) PRIMARY KEY,
    Label NVARCHAR(50) NOT NULL UNIQUE, -- e.g., "2025-09", "2025-Q1", "2025-FY"
    Kind VARCHAR(20) NOT NULL, -- Month, Quarter, FY
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    CONSTRAINT CHK_Periods_Kind CHECK (Kind IN ('Month', 'Quarter', 'FY'))
);

CREATE INDEX IX_Periods_Label ON Periods(Label);
CREATE INDEX IX_Periods_StartDate ON Periods(StartDate);
CREATE INDEX IX_Periods_EndDate ON Periods(EndDate);
```

### 20. TargetBatches Table

**Purpose**: Stores target batch information

```sql
CREATE TABLE TargetBatches (
    Id VARCHAR(50) PRIMARY KEY,
    PeriodId VARCHAR(50) NOT NULL,
    RegionId VARCHAR(50) NULL,
    OwnerUserId VARCHAR(50) NULL,
    Status VARCHAR(20) NOT NULL DEFAULT 'draft', -- draft, submitted, approved, rejected
    Note NVARCHAR(1000) NULL,
    CreatedBy VARCHAR(50) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    ApprovedAt DATETIME2 NULL,
    ApprovedBy VARCHAR(50) NULL,
    
    CONSTRAINT FK_TargetBatches_Period FOREIGN KEY (PeriodId) REFERENCES Periods(Id),
    CONSTRAINT FK_TargetBatches_Region FOREIGN KEY (RegionId) REFERENCES Regions(Id),
    CONSTRAINT FK_TargetBatches_Owner FOREIGN KEY (OwnerUserId) REFERENCES Users(Id),
    CONSTRAINT FK_TargetBatches_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES Users(Id),
    CONSTRAINT FK_TargetBatches_ApprovedBy FOREIGN KEY (ApprovedBy) REFERENCES Users(Id),
    CONSTRAINT CHK_TargetBatches_Status CHECK (Status IN ('draft', 'submitted', 'approved', 'rejected'))
);

CREATE INDEX IX_TargetBatches_PeriodId ON TargetBatches(PeriodId);
CREATE INDEX IX_TargetBatches_RegionId ON TargetBatches(RegionId);
CREATE INDEX IX_TargetBatches_OwnerUserId ON TargetBatches(OwnerUserId);
CREATE INDEX IX_TargetBatches_Status ON TargetBatches(Status);
```

### 21. TargetRows Table

**Purpose**: Stores individual target rows

```sql
CREATE TABLE TargetRows (
    Id VARCHAR(50) PRIMARY KEY,
    BatchId VARCHAR(50) NOT NULL,
    PeriodId VARCHAR(50) NOT NULL,
    CustomerId VARCHAR(50) NOT NULL,
    SkuId VARCHAR(50) NOT NULL,
    OwnerUserId VARCHAR(50) NULL,
    Uom VARCHAR(20) NOT NULL, -- cases, units, litres, value
    TargetQty DECIMAL(18, 2) NOT NULL,
    TargetValueNgn DECIMAL(18, 2) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    
    CONSTRAINT FK_TargetRows_Batch FOREIGN KEY (BatchId) REFERENCES TargetBatches(Id) ON DELETE CASCADE,
    CONSTRAINT FK_TargetRows_Period FOREIGN KEY (PeriodId) REFERENCES Periods(Id),
    CONSTRAINT FK_TargetRows_Customer FOREIGN KEY (CustomerId) REFERENCES Customers(Id),
    CONSTRAINT FK_TargetRows_SKU FOREIGN KEY (SkuId) REFERENCES SKUs(Id),
    CONSTRAINT FK_TargetRows_Owner FOREIGN KEY (OwnerUserId) REFERENCES Users(Id),
    CONSTRAINT CHK_TargetRows_Uom CHECK (Uom IN ('cases', 'units', 'litres', 'value')),
    CONSTRAINT UQ_TargetRows_BatchCustomerSKU UNIQUE (BatchId, CustomerId, SkuId)
);

CREATE INDEX IX_TargetRows_BatchId ON TargetRows(BatchId);
CREATE INDEX IX_TargetRows_CustomerId ON TargetRows(CustomerId);
CREATE INDEX IX_TargetRows_SkuId ON TargetRows(SkuId);
CREATE INDEX IX_TargetRows_OwnerUserId ON TargetRows(OwnerUserId);
```

### 22. Resources Table

**Purpose**: Stores resource/document information

```sql
CREATE TABLE Resources (
    Id VARCHAR(50) PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(1000) NULL,
    Type VARCHAR(20) NOT NULL, -- pdf, doc, excel, video, link, faq
    CategoryId VARCHAR(50) NOT NULL,
    Tags NVARCHAR(500) NULL, -- JSON array
    Url NVARCHAR(500) NOT NULL,
    UploadedBy VARCHAR(50) NOT NULL,
    UploadedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    Version NVARCHAR(50) NULL,
    Status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, archived
    VisibilityRoles NVARCHAR(500) NULL, -- JSON array
    DownloadCount INT NOT NULL DEFAULT 0,
    
    CONSTRAINT FK_Resources_Category FOREIGN KEY (CategoryId) REFERENCES ResourceCategories(Id),
    CONSTRAINT FK_Resources_UploadedBy FOREIGN KEY (UploadedBy) REFERENCES Users(Id),
    CONSTRAINT CHK_Resources_Type CHECK (Type IN ('pdf', 'doc', 'excel', 'video', 'link', 'faq')),
    CONSTRAINT CHK_Resources_Status CHECK (Status IN ('active', 'archived'))
);

CREATE INDEX IX_Resources_CategoryId ON Resources(CategoryId);
CREATE INDEX IX_Resources_Type ON Resources(Type);
CREATE INDEX IX_Resources_Status ON Resources(Status);
CREATE FULLTEXT INDEX ON Resources(Title, Description);
```

### 23. ResourceCategories Table

**Purpose**: Stores resource category information

```sql
CREATE TABLE ResourceCategories (
    Id VARCHAR(50) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL UNIQUE,
    Description NVARCHAR(500) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
```

### 24. ResourceInteractions Table

**Purpose**: Stores resource interaction history

```sql
CREATE TABLE ResourceInteractions (
    Id VARCHAR(50) PRIMARY KEY,
    ResourceId VARCHAR(50) NOT NULL,
    UserId VARCHAR(50) NOT NULL,
    Action VARCHAR(20) NOT NULL, -- viewed, downloaded, favorited
    Timestamp DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    CONSTRAINT FK_ResourceInteractions_Resource FOREIGN KEY (ResourceId) REFERENCES Resources(Id) ON DELETE CASCADE,
    CONSTRAINT FK_ResourceInteractions_User FOREIGN KEY (UserId) REFERENCES Users(Id),
    CONSTRAINT CHK_ResourceInteractions_Action CHECK (Action IN ('viewed', 'downloaded', 'favorited'))
);

CREATE INDEX IX_ResourceInteractions_ResourceId ON ResourceInteractions(ResourceId);
CREATE INDEX IX_ResourceInteractions_UserId ON ResourceInteractions(UserId);
CREATE INDEX IX_ResourceInteractions_Timestamp ON ResourceInteractions(Timestamp);
```

## Views

### 1. CustomerKPIs View

**Purpose**: Aggregates customer KPI data

```sql
CREATE VIEW CustomerKPIs AS
SELECT 
    c.Id AS CustomerId,
    SUM(CASE WHEN o.OrderedAt >= DATEADD(DAY, -90, GETUTCDATE()) THEN o.TotalNgn ELSE 0 END) AS Last90dRevenue,
    SUM(CASE WHEN YEAR(o.OrderedAt) = YEAR(GETUTCDATE()) THEN o.TotalNgn ELSE 0 END) AS YtdRevenue,
    COUNT(CASE WHEN o.OrderedAt >= DATEADD(DAY, -90, GETUTCDATE()) THEN 1 END) AS OrdersCount90d,
    AVG(CASE WHEN o.OrderedAt >= DATEADD(DAY, -90, GETUTCDATE()) THEN o.TotalNgn END) AS Aov,
    -- Additional KPIs can be calculated here
    c.CreatedAt
FROM Customers c
LEFT JOIN Orders o ON o.CustomerId = c.Id
GROUP BY c.Id, c.CreatedAt;
```

### 2. RoutePerformance View

**Purpose**: Aggregates route performance data

```sql
CREATE VIEW RoutePerformance AS
SELECT 
    r.Id AS RouteId,
    FORMAT(rv.ScheduledDate, 'yyyy-MM') AS Period,
    COUNT(rv.Id) AS TotalVisits,
    SUM(CASE WHEN rv.Status = 'completed' THEN 1 ELSE 0 END) AS CompletedVisits,
    CASE 
        WHEN COUNT(rv.Id) > 0 
        THEN CAST(SUM(CASE WHEN rv.Status = 'completed' THEN 1 ELSE 0 END) AS DECIMAL) / COUNT(rv.Id) * 100
        ELSE 0 
    END AS CompletionRate,
    -- Additional metrics can be calculated here
    r.CreatedAt
FROM Routes r
LEFT JOIN RouteVisits rv ON rv.RouteId = r.Id
GROUP BY r.Id, FORMAT(rv.ScheduledDate, 'yyyy-MM'), r.CreatedAt;
```

## Stored Procedures

### 1. CalculateCreditAging

**Purpose**: Calculates and updates customer credit aging

```sql
CREATE PROCEDURE CalculateCreditAging
    @CustomerId VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @B0_30 DECIMAL(18, 2) = 0;
    DECLARE @B31_60 DECIMAL(18, 2) = 0;
    DECLARE @B61_90 DECIMAL(18, 2) = 0;
    DECLARE @B90p DECIMAL(18, 2) = 0;
    
    -- Calculate aging buckets based on order dates and payment status
    SELECT 
        @B0_30 = SUM(CASE WHEN DATEDIFF(DAY, o.OrderedAt, GETUTCDATE()) <= 30 THEN o.TotalNgn - ISNULL(p.PaidAmount, 0) ELSE 0 END),
        @B31_60 = SUM(CASE WHEN DATEDIFF(DAY, o.OrderedAt, GETUTCDATE()) BETWEEN 31 AND 60 THEN o.TotalNgn - ISNULL(p.PaidAmount, 0) ELSE 0 END),
        @B61_90 = SUM(CASE WHEN DATEDIFF(DAY, o.OrderedAt, GETUTCDATE()) BETWEEN 61 AND 90 THEN o.TotalNgn - ISNULL(p.PaidAmount, 0) ELSE 0 END),
        @B90p = SUM(CASE WHEN DATEDIFF(DAY, o.OrderedAt, GETUTCDATE()) > 90 THEN o.TotalNgn - ISNULL(p.PaidAmount, 0) ELSE 0 END)
    FROM Orders o
    LEFT JOIN (
        SELECT OrderId, SUM(PaidAmount) AS PaidAmount
        FROM PaymentApplications pa
        JOIN Payments p ON p.Id = pa.PaymentId
        WHERE p.PaymentStatus = 'Successful'
        GROUP BY OrderId
    ) p ON p.OrderId = o.Id
    WHERE o.CustomerId = @CustomerId
        AND o.PaymentStatus != 'paid'
        AND o.Status != 'cancelled';
    
    -- Update or insert credit aging
    MERGE CreditAging AS target
    USING (SELECT @CustomerId AS CustomerId) AS source
    ON target.CustomerId = source.CustomerId
    WHEN MATCHED THEN
        UPDATE SET 
            B0_30 = @B0_30,
            B31_60 = @B31_60,
            B61_90 = @B61_90,
            B90p = @B90p,
            CalculatedAt = GETUTCDATE()
    WHEN NOT MATCHED THEN
        INSERT (Id, CustomerId, B0_30, B31_60, B61_90, B90p, CalculatedAt)
        VALUES (NEWID(), @CustomerId, @B0_30, @B31_60, @B61_90, @B90p, GETUTCDATE());
END;
```

### 2. UpdateCustomerCreditExposure

**Purpose**: Updates customer credit exposure

```sql
CREATE PROCEDURE UpdateCustomerCreditExposure
    @CustomerId VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @Exposure DECIMAL(18, 2) = 0;
    
    -- Calculate total exposure from unpaid orders
    SELECT @Exposure = SUM(o.TotalNgn - ISNULL(p.PaidAmount, 0))
    FROM Orders o
    LEFT JOIN (
        SELECT OrderId, SUM(PaidAmount) AS PaidAmount
        FROM PaymentApplications pa
        JOIN Payments p ON p.Id = pa.PaymentId
        WHERE p.PaymentStatus = 'Successful'
        GROUP BY OrderId
    ) p ON p.OrderId = o.Id
    WHERE o.CustomerId = @CustomerId
        AND o.PaymentStatus != 'paid'
        AND o.Status != 'cancelled';
    
    -- Update customer credit exposure
    UPDATE Customers
    SET CreditExposure = @Exposure,
        UpdatedAt = GETUTCDATE()
    WHERE Id = @CustomerId;
    
    -- Recalculate credit aging
    EXEC CalculateCreditAging @CustomerId;
END;
```

## Indexes Strategy

### Primary Indexes
- All tables have clustered primary key indexes on `Id` column

### Foreign Key Indexes
- All foreign key columns are indexed for join performance

### Query Performance Indexes
- Date/time columns used in WHERE clauses
- Status columns used in filtering
- Search columns (Code, Name, Email)
- Composite indexes for common query patterns

### Full-Text Search
- Resources table has full-text index on Title and Description

## Data Migration Strategy

### Initial Data Seeding

1. **Regions**: Pre-populated with 9 Nigerian regions
2. **Channels**: Pre-populated with 4 sales channels
3. **DealerTypes**: Pre-populated with 4 dealer types
4. **SKUs**: Seeded with product catalog
5. **Periods**: Auto-generated for current and future periods

### Migration Scripts

Use EF Core Migrations for schema changes:

```bash
# Create migration
dotnet ef migrations add MigrationName

# Apply migration
dotnet ef database update

# Rollback migration
dotnet ef database update PreviousMigrationName
```

## Backup and Recovery

### Backup Strategy
- **Full Backup**: Daily at 2 AM
- **Differential Backup**: Every 6 hours
- **Transaction Log Backup**: Every 15 minutes
- **Retention**: 30 days for full backups, 7 days for differential, 24 hours for transaction logs

### Recovery Procedures
1. Identify point of failure
2. Restore most recent full backup
3. Apply differential backups in sequence
4. Apply transaction log backups up to point of failure
5. Verify data integrity

## Performance Optimization

### Query Optimization
- Use parameterized queries to prevent SQL injection
- Avoid SELECT * - only select required columns
- Use appropriate indexes for WHERE, JOIN, and ORDER BY clauses
- Consider query hints for complex queries

### Caching Strategy
- Cache frequently accessed reference data (Regions, Channels, SKUs)
- Use Redis for session and application-level caching
- Implement query result caching for expensive aggregations

### Partitioning (Future)
- Consider partitioning large tables (Orders, Payments) by date
- Partition by region for multi-tenant scenarios

## Security Considerations

### Data Encryption
- Encrypt sensitive data at rest (customer PII, payment information)
- Use TLS/SSL for data in transit
- Encrypt database backups

### Access Control
- Implement row-level security for multi-tenant scenarios
- Use database roles for different user types
- Audit all data access and modifications

### SQL Injection Prevention
- Always use parameterized queries
- Validate and sanitize all user inputs
- Use ORM (EF Core) to prevent direct SQL injection

## Monitoring and Maintenance

### Performance Monitoring
- Monitor query execution times
- Track index usage and fragmentation
- Monitor database size and growth

### Maintenance Tasks
- **Index Rebuild**: Weekly during off-peak hours
- **Statistics Update**: Daily
- **Database Integrity Check**: Weekly
- **Log File Management**: Daily

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-27  
**Author**: Development Team

