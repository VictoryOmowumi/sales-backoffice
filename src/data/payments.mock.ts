import { faker } from "@faker-js/faker";
import { subDays, formatISO } from "date-fns";
import type { 
  PaymentTransaction, 
  PaymentsOverview, 
  PaymentsAnalytics, 
  PaymentsKPIs,
  PaymentStatus,
  PaymentProvider,
  BankRevenue,
  RegionalCollection,
  DailyCollection,
  CollectionByBank
} from "@/domain/payments";

function id() {
  return faker.string.uuid();
}

// Bank configurations
const banks: BankRevenue[] = [
  {
    bankName: "Access Bank Virtual Accounts",
    amount: "4.5B",
    providerCode: "ABVA",
    logoImage: "https://paymentsgw.sevenup.org/service/Images/ABVA.png",
    backgroundColor: "#FFF",
    textColor: "#FF2123",
    paymentType: 2,
    rawAmount: 4521853763.83
  },
  {
    bankName: "Zenith Bank Virtual Account",
    amount: "3.4B",
    providerCode: "ZBVA",
    logoImage: "https://paymentsgw.sevenup.org/service/Images/ZBVA.png",
    backgroundColor: "#FFF",
    textColor: "#FF2123",
    paymentType: 2,
    rawAmount: 3413106812.20
  },
  {
    bankName: "Globus Bank Virtual Account",
    amount: "1.6B",
    providerCode: "GBVA",
    logoImage: "https://paymentsgw.sevenup.org/service/Images/GBVA.png",
    backgroundColor: null,
    textColor: null,
    paymentType: 2,
    rawAmount: 1639765103.73
  },
  {
    bankName: "GTB Virtual Account",
    amount: "1.0B",
    providerCode: "GTB",
    logoImage: "https://paymentsgw.sevenup.org/service/Images/GTB.png",
    backgroundColor: "#FFF",
    textColor: "#00A651",
    paymentType: 2,
    rawAmount: 1006784579.11
  }
];

const regions = [
  "Aba", "Abuja", "Benin", "Enugu", "Ibadan", 
  "Ikeja", "Ilorin", "Kaduna", "Kano"
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Generate realistic payment transactions
export function seedPaymentTransactions(count: number = 1000): PaymentTransaction[] {
  faker.seed(42);
  
  const transactions: PaymentTransaction[] = [];
  const startDate = subDays(new Date(), 30);
  
  for (let i = 0; i < count; i++) {
    const bank = faker.helpers.arrayElement(banks);
    const region = faker.helpers.arrayElement(regions);
    const status = faker.helpers.weightedArrayElement([
      { weight: 95, value: "Successful" as PaymentStatus },
      { weight: 3, value: "Failed" as PaymentStatus },
      { weight: 2, value: "Pending" as PaymentStatus }
    ]);
    
    const amount = faker.number.int({ min: 1000, max: 5000000 });
    const paymentDate = faker.date.between({ from: startDate, to: new Date() });
    
    transactions.push({
      id: 570234 + i,
      token: null,
      amount,
      customerId: `IK${faker.string.alphanumeric(8).toUpperCase()}`,
      email: faker.helpers.maybe(() => faker.internet.email(), { probability: 0.3 }),
      orderId: faker.helpers.maybe(() => faker.number.int({ min: 1000, max: 9999 }).toString(), { probability: 0.7 }) || "0",
      securityCode: null,
      collectionBankAccount: null,
      collectionBankCode: null,
      sourceBankCode: null,
      customerAccountNumber: faker.helpers.maybe(() => faker.finance.accountNumber(), { probability: 0.2 }),
      transactionReference: id(),
      paymentStatus: status,
      naration: `TRSF//${faker.finance.accountNumber().slice(0, 3)}***${faker.finance.accountNumber().slice(-4)}/${faker.person.fullName().toUpperCase()}`,
      customerName: faker.person.fullName().toUpperCase(),
      paidAmount: status === "Successful" ? amount : 0,
      customerFee: 0,
      merchantFee: Math.round(amount * 0.002), // 0.2% merchant fee
      vendorTransactionRef: `VPAY${faker.number.int({ min: 100000000000000000000000000, max: 999999999999999999999999999 })}`,
      paymentProvider: bank.providerCode,
      applicationId: 2,
      paymentDate: formatISO(paymentDate),
      tellerNo: `${bank.providerCode}${570234 + i}`,
      tellerCreated: null,
      bankAccountCode: "",
      bankName: bank.bankName.split(" ")[0] + " " + bank.bankName.split(" ")[1], // Extract bank name
      bankDescription: bank.bankName,
      invoiceCreated: status === "Successful",
      invoiceNumber: faker.helpers.maybe(() => `INV${faker.number.int({ min: 100000, max: 999999 })}`, { probability: 0.8 }),
      processed: status === "Successful",
      processedDate: status === "Successful" ? formatISO(paymentDate) : null,
      navisionProcessed: status === "Successful",
      notificationReceived: status === "Successful",
      logo: bank.logoImage,
      paymentType: bank.paymentType,
      regionCode: region,
      createdDate: formatISO(paymentDate),
      formattedDate: paymentDate.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      }),
      formattedAmount: null,
      notificationRequeryable: true,
      channelName: faker.helpers.arrayElement(["Distributor", "Wholesale", "Retail", "Modern Trade"]),
      logList: []
    });
  }
  
  return transactions.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
}

// Generate payments overview data
export function generatePaymentsOverview(transactions: PaymentTransaction[]): PaymentsOverview {
  const totalRevenue = transactions
    .filter(t => t.paymentStatus === "Successful")
    .reduce((sum, t) => sum + t.paidAmount, 0);
  
  const successfulCount = transactions.filter(t => t.paymentStatus === "Successful").length;
  const failedCount = transactions.filter(t => t.paymentStatus === "Failed").length;
  
  return {
    allRevenueAmount: formatCurrency(totalRevenue),
    successfulTransactionsCount: successfulCount,
    failedTransactionsCount: failedCount,
    bankRevenue: banks.map(bank => ({
      ...bank,
      rawAmount: transactions
        .filter(t => t.paymentProvider === bank.providerCode && t.paymentStatus === "Successful")
        .reduce((sum, t) => sum + t.paidAmount, 0)
    }))
  };
}

// Generate payments analytics data
export function generatePaymentsAnalytics(transactions: PaymentTransaction[]): PaymentsAnalytics {
  // Regional collection
  const regionalCollection: RegionalCollection[] = regions.map(region => ({
    amount: transactions
      .filter(t => t.regionCode === region && t.paymentStatus === "Successful")
      .reduce((sum, t) => sum + t.paidAmount, 0),
    text: region,
    description: null
  }));

  // Daily collection (last 7 days)
  const dailyCollection: DailyCollection[] = days.map(day => ({
    amount: transactions
      .filter(t => {
        const date = new Date(t.paymentDate);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        return dayName === day && t.paymentStatus === "Successful";
      })
      .reduce((sum, t) => sum + t.paidAmount, 0),
    text: day,
    description: null
  }));

  // Collection by bank
  const collectionByBank: CollectionByBank[] = banks.map(bank => ({
    amount: transactions
      .filter(t => t.paymentProvider === bank.providerCode && t.paymentStatus === "Successful")
      .reduce((sum, t) => sum + t.paidAmount, 0),
    text: bank.bankName.split(" ")[0] + " " + bank.bankName.split(" ")[1],
    description: bank.bankName
  }));

  return {
    regionalCollection,
    dailyCollection,
    collectionByBank
  };
}

// Generate KPIs
export function generatePaymentsKPIs(transactions: PaymentTransaction[]): PaymentsKPIs {
  const successfulTransactions = transactions.filter(t => t.paymentStatus === "Successful");
  const failedTransactions = transactions.filter(t => t.paymentStatus === "Failed");
  
  const totalRevenue = successfulTransactions.reduce((sum, t) => sum + t.paidAmount, 0);
  const totalTransactions = transactions.length;
  const collectionSuccessRate = totalTransactions > 0 ? (successfulTransactions.length / totalTransactions) * 100 : 0;
  const failedTransactionsValue = failedTransactions.reduce((sum, t) => sum + t.amount, 0);
  const avgTransactionValue = successfulTransactions.length > 0 ? totalRevenue / successfulTransactions.length : 0;
  
  // Find largest customer payment this week
  const oneWeekAgo = subDays(new Date(), 7);
  const recentTransactions = successfulTransactions.filter(t => 
    new Date(t.paymentDate) >= oneWeekAgo
  );
  const largestCustomerPayment = recentTransactions.length > 0 
    ? Math.max(...recentTransactions.map(t => t.paidAmount))
    : 0;

  return {
    totalRevenue,
    collectionSuccessRate,
    failedTransactionsCount: failedTransactions.length,
    failedTransactionsValue,
    avgTransactionValue,
    largestCustomerPayment,
    totalTransactions
  };
}

// Helper function to format currency
function formatCurrency(amount: number): string {
  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(1)}B`;
  } else if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K`;
  }
  return amount.toString();
}

// Generate all payments data
export function seedPaymentsData() {
  const transactions = seedPaymentTransactions(1000);
  const overview = generatePaymentsOverview(transactions);
  const analytics = generatePaymentsAnalytics(transactions);
  const kpis = generatePaymentsKPIs(transactions);
  
  return {
    transactions,
    overview,
    analytics,
    kpis
  };
}
