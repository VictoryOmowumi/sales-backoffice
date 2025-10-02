export type PaymentStatus = "Successful" | "Failed" | "Pending";

export type PaymentProvider = "ABVA" | "ZBVA" | "GBVA" | "GTB" | "Paystack" | "Flutterwave" | "Interswitch";

export type PaymentType = 1 | 2; // 1 = Direct, 2 = Virtual Account

export type BankRevenue = {
  bankName: string;
  amount: string;
  providerCode: PaymentProvider;
  logoImage: string;
  backgroundColor: string | null;
  textColor: string | null;
  paymentType: PaymentType;
  rawAmount: number;
};

export type RegionalCollection = {
  amount: number;
  text: string;
  description: string | null;
};

export type DailyCollection = {
  amount: number;
  text: string;
  description: string | null;
};

export type CollectionByBank = {
  amount: number;
  text: string;
  description: string;
};

export type PaymentTransaction = {
  id: number;
  token: string | null;
  amount: number;
  customerId: string;
  email: string | null;
  orderId: string;
  securityCode: string | null;
  collectionBankAccount: string | null;
  collectionBankCode: string | null;
  sourceBankCode: string | null;
  customerAccountNumber: string | null;
  transactionReference: string;
  paymentStatus: PaymentStatus;
  naration: string;
  customerName: string;
  paidAmount: number;
  customerFee: number;
  merchantFee: number;
  vendorTransactionRef: string;
  paymentProvider: PaymentProvider;
  applicationId: number;
  paymentDate: string;
  tellerNo: string;
  tellerCreated: string | null;
  bankAccountCode: string;
  bankName: string;
  bankDescription: string;
  invoiceCreated: boolean;
  invoiceNumber: string;
  processed: boolean;
  processedDate: string | null;
  navisionProcessed: boolean;
  notificationReceived: boolean;
  logo: string | null;
  paymentType: PaymentType;
  regionCode: string;
  createdDate: string;
  formattedDate: string;
  formattedAmount: string | null;
  notificationRequeryable: boolean;
  channelName: string | null;
  logList: unknown[];
};

export type PaymentsOverview = {
  allRevenueAmount: string;
  successfulTransactionsCount: number;
  failedTransactionsCount: number;
  bankRevenue: BankRevenue[];
};

export type PaymentsAnalytics = {
  regionalCollection: RegionalCollection[];
  dailyCollection: DailyCollection[];
  collectionByBank: CollectionByBank[];
};

export type PaymentsKPIs = {
  totalRevenue: number;
  collectionSuccessRate: number;
  failedTransactionsCount: number;
  failedTransactionsValue: number;
  avgTransactionValue: number;
  largestCustomerPayment: number;
  totalTransactions: number;
};
