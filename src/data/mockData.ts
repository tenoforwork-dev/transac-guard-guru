export type TransactionStatus = "Fraud" | "Genuine" | "Unknown" | "Pending";
export type RuleStatus = "Active" | "Disabled";

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  date: string;
  location: string;
  paymentMethod: string;
  riskScore: number;
  ruleTriggered: string | null;
  status: TransactionStatus;
  description: string;
}

export interface FraudRule {
  id: string;
  name: string;
  description: string;
  riskThreshold: number;
  createdBy: string;
  dateCreated: string;
  status: RuleStatus;
  triggerCount: number;
  logic: string;
  conditions: Array<{ field: string; operator: string; value: string }>;
}

export interface FraudAlert {
  id: string;
  transactionId: string;
  amount: number;
  riskScore: number;
  triggeredRule: string;
  timeDetected: string;
  userId: string;
  location: string;
  reviewed: boolean;
}

export interface ModeratorDecision {
  transactionId: string;
  decision: TransactionStatus;
  moderator: string;
  timestamp: string;
  comment: string;
}

export const fraudRules: FraudRule[] = [
  {
    id: "RULE-001",
    name: "Large Amount Transfer",
    description: "Flags transactions above $5,000 from unverified accounts",
    riskThreshold: 75,
    createdBy: "Sarah Mitchell",
    dateCreated: "2024-11-15",
    status: "Active",
    triggerCount: 234,
    logic: "IF amount > $5000 AND account_verified = false",
    conditions: [
      { field: "amount", operator: ">", value: "5000" },
      { field: "account_verified", operator: "=", value: "false" },
    ],
  },
  {
    id: "RULE-002",
    name: "Location Mismatch",
    description: "Detects transactions from unusual geographic locations",
    riskThreshold: 80,
    createdBy: "James Carter",
    dateCreated: "2024-11-20",
    status: "Active",
    triggerCount: 189,
    logic: "IF location != user_home_country AND amount > $1000",
    conditions: [
      { field: "location", operator: "!=", value: "user_home_country" },
      { field: "amount", operator: ">", value: "1000" },
    ],
  },
  {
    id: "RULE-003",
    name: "Rapid Succession Transactions",
    description: "Multiple transactions within a short time window",
    riskThreshold: 70,
    createdBy: "Emily Rogers",
    dateCreated: "2024-12-01",
    status: "Active",
    triggerCount: 156,
    logic: "IF transaction_count_1hr > 5 AND total_amount_1hr > $3000",
    conditions: [
      { field: "transaction_count_1hr", operator: ">", value: "5" },
      { field: "total_amount_1hr", operator: ">", value: "3000" },
    ],
  },
  {
    id: "RULE-004",
    name: "New Device High Value",
    description: "High-value transaction from a new/unrecognized device",
    riskThreshold: 85,
    createdBy: "Sarah Mitchell",
    dateCreated: "2024-12-10",
    status: "Active",
    triggerCount: 98,
    logic: "IF new_device = true AND amount > $2000",
    conditions: [
      { field: "new_device", operator: "=", value: "true" },
      { field: "amount", operator: ">", value: "2000" },
    ],
  },
  {
    id: "RULE-005",
    name: "Crypto Exchange Pattern",
    description: "Unusual crypto exchange transactions from retail accounts",
    riskThreshold: 65,
    createdBy: "James Carter",
    dateCreated: "2024-12-15",
    status: "Disabled",
    triggerCount: 45,
    logic: "IF merchant_category = 'crypto' AND account_type = 'retail'",
    conditions: [
      { field: "merchant_category", operator: "=", value: "crypto" },
      { field: "account_type", operator: "=", value: "retail" },
    ],
  },
  {
    id: "RULE-006",
    name: "Night Time Large Transfer",
    description: "Large transfers occurring between midnight and 5 AM",
    riskThreshold: 60,
    createdBy: "Emily Rogers",
    dateCreated: "2025-01-05",
    status: "Active",
    triggerCount: 72,
    logic: "IF hour < 5 AND amount > $3000",
    conditions: [
      { field: "hour", operator: "<", value: "5" },
      { field: "amount", operator: ">", value: "3000" },
    ],
  },
  {
    id: "RULE-007",
    name: "Blacklisted Merchant",
    description: "Transactions with merchants on the blacklist",
    riskThreshold: 90,
    createdBy: "Admin",
    dateCreated: "2025-01-10",
    status: "Active",
    triggerCount: 33,
    logic: "IF merchant_id IN blacklist_table",
    conditions: [{ field: "merchant_id", operator: "in", value: "blacklist" }],
  },
  {
    id: "RULE-008",
    name: "VPN Usage Detection",
    description: "Transactions originating from VPN or proxy services",
    riskThreshold: 55,
    createdBy: "James Carter",
    dateCreated: "2025-01-18",
    status: "Disabled",
    triggerCount: 211,
    logic: "IF ip_is_vpn = true AND amount > $500",
    conditions: [
      { field: "ip_is_vpn", operator: "=", value: "true" },
      { field: "amount", operator: ">", value: "500" },
    ],
  },
];

export const transactions: Transaction[] = [
  { id: "TXN-8821", userId: "USR-1042", amount: 12500, date: "2025-02-18 14:32:11", location: "Lagos, NG", paymentMethod: "Wire Transfer", riskScore: 92, ruleTriggered: "Large Amount Transfer", status: "Fraud", description: "International wire to unverified account" },
  { id: "TXN-8822", userId: "USR-2318", amount: 340, date: "2025-02-18 13:15:00", location: "New York, US", paymentMethod: "Credit Card", riskScore: 12, ruleTriggered: null, status: "Genuine", description: "Online retail purchase" },
  { id: "TXN-8823", userId: "USR-5531", amount: 7800, date: "2025-02-18 11:02:45", location: "Dubai, AE", paymentMethod: "Crypto", riskScore: 88, ruleTriggered: "Location Mismatch", status: "Fraud", description: "Crypto exchange from new location" },
  { id: "TXN-8824", userId: "USR-1042", amount: 6200, date: "2025-02-18 10:45:00", location: "London, UK", paymentMethod: "Bank Transfer", riskScore: 79, ruleTriggered: "New Device High Value", status: "Pending", description: "Large bank transfer from new device" },
  { id: "TXN-8825", userId: "USR-3307", amount: 89, date: "2025-02-17 22:15:00", location: "Toronto, CA", paymentMethod: "Debit Card", riskScore: 8, ruleTriggered: null, status: "Genuine", description: "Grocery store purchase" },
  { id: "TXN-8826", userId: "USR-7789", amount: 4500, date: "2025-02-17 03:12:00", location: "Singapore, SG", paymentMethod: "Wire Transfer", riskScore: 71, ruleTriggered: "Night Time Large Transfer", status: "Fraud", description: "Late night large transfer" },
  { id: "TXN-8827", userId: "USR-4421", amount: 1250, date: "2025-02-17 15:33:00", location: "Paris, FR", paymentMethod: "Credit Card", riskScore: 45, ruleTriggered: "Location Mismatch", status: "Unknown", description: "Purchase from user traveling abroad" },
  { id: "TXN-8828", userId: "USR-6612", amount: 22000, date: "2025-02-17 09:00:00", location: "Cayman Islands, KY", paymentMethod: "Wire Transfer", riskScore: 96, ruleTriggered: "Large Amount Transfer", status: "Fraud", description: "Offshore transfer to shell company" },
  { id: "TXN-8829", userId: "USR-2318", amount: 199, date: "2025-02-16 18:45:00", location: "New York, US", paymentMethod: "Credit Card", riskScore: 5, ruleTriggered: null, status: "Genuine", description: "Subscription renewal" },
  { id: "TXN-8830", userId: "USR-9901", amount: 3300, date: "2025-02-16 16:20:00", location: "Moscow, RU", paymentMethod: "Crypto", riskScore: 83, ruleTriggered: "Crypto Exchange Pattern", status: "Fraud", description: "High-value crypto purchase from blacklisted region" },
  { id: "TXN-8831", userId: "USR-1155", amount: 550, date: "2025-02-16 12:10:00", location: "Chicago, US", paymentMethod: "Debit Card", riskScore: 18, ruleTriggered: null, status: "Genuine", description: "Electronics purchase" },
  { id: "TXN-8832", userId: "USR-3307", amount: 8700, date: "2025-02-15 20:05:00", location: "Bali, ID", paymentMethod: "Credit Card", riskScore: 74, ruleTriggered: "Location Mismatch", status: "Pending", description: "Hotel booking from unusual location" },
  { id: "TXN-8833", userId: "USR-5531", amount: 125, date: "2025-02-15 11:30:00", location: "Dubai, AE", paymentMethod: "Credit Card", riskScore: 22, ruleTriggered: null, status: "Genuine", description: "Restaurant payment" },
  { id: "TXN-8834", userId: "USR-8844", amount: 18500, date: "2025-02-15 08:22:00", location: "Zurich, CH", paymentMethod: "Wire Transfer", riskScore: 91, ruleTriggered: "Large Amount Transfer", status: "Fraud", description: "Unusually large wire transfer" },
  { id: "TXN-8835", userId: "USR-2200", amount: 420, date: "2025-02-14 19:45:00", location: "Los Angeles, US", paymentMethod: "Credit Card", riskScore: 14, ruleTriggered: null, status: "Genuine", description: "Online shopping" },
  { id: "TXN-8836", userId: "USR-4421", amount: 3700, date: "2025-02-14 02:30:00", location: "Amsterdam, NL", paymentMethod: "Bank Transfer", riskScore: 76, ruleTriggered: "Night Time Large Transfer", status: "Unknown", description: "Pre-dawn large transfer" },
  { id: "TXN-8837", userId: "USR-7789", amount: 660, date: "2025-02-13 14:00:00", location: "Singapore, SG", paymentMethod: "Debit Card", riskScore: 28, ruleTriggered: null, status: "Genuine", description: "Business lunch payment" },
  { id: "TXN-8838", userId: "USR-1042", amount: 9200, date: "2025-02-13 10:15:00", location: "Hong Kong, HK", paymentMethod: "Wire Transfer", riskScore: 87, ruleTriggered: "New Device High Value", status: "Fraud", description: "High-value transfer from newly registered device" },
  { id: "TXN-8839", userId: "USR-3307", amount: 75, date: "2025-02-12 17:20:00", location: "Toronto, CA", paymentMethod: "Credit Card", riskScore: 6, ruleTriggered: null, status: "Genuine", description: "Coffee shop" },
  { id: "TXN-8840", userId: "USR-9901", amount: 5100, date: "2025-02-12 09:00:00", location: "Kiev, UA", paymentMethod: "Crypto", riskScore: 85, ruleTriggered: "Blacklisted Merchant", status: "Fraud", description: "Transaction with blacklisted merchant" },
];

export const fraudAlerts: FraudAlert[] = transactions
  .filter(t => t.status === "Fraud" || (t.riskScore > 70 && t.status === "Pending"))
  .map(t => ({
    id: `ALT-${t.id.split("-")[1]}`,
    transactionId: t.id,
    amount: t.amount,
    riskScore: t.riskScore,
    triggeredRule: t.ruleTriggered || "Anomaly Detection",
    timeDetected: t.date,
    userId: t.userId,
    location: t.location,
    reviewed: false,
  }));

export const genuineTransactions = transactions.filter(t => t.status === "Genuine");

export const fraudVolumeData = [
  { date: "Feb 01", count: 3 },
  { date: "Feb 02", count: 5 },
  { date: "Feb 03", count: 2 },
  { date: "Feb 04", count: 7 },
  { date: "Feb 05", count: 4 },
  { date: "Feb 06", count: 8 },
  { date: "Feb 07", count: 6 },
  { date: "Feb 08", count: 11 },
  { date: "Feb 09", count: 9 },
  { date: "Feb 10", count: 5 },
  { date: "Feb 11", count: 13 },
  { date: "Feb 12", count: 7 },
  { date: "Feb 13", count: 10 },
  { date: "Feb 14", count: 8 },
  { date: "Feb 15", count: 15 },
  { date: "Feb 16", count: 12 },
  { date: "Feb 17", count: 9 },
  { date: "Feb 18", count: 6 },
];

export const ruleBreakData = fraudRules
  .filter(r => r.status === "Active")
  .map(r => ({
    name: r.name.length > 20 ? r.name.substring(0, 18) + "..." : r.name,
    fullName: r.name,
    count: r.triggerCount,
  }));

export const distributionData = [
  { name: "Fraud", value: transactions.filter(t => t.status === "Fraud").length, color: "hsl(0 84% 60%)" },
  { name: "Genuine", value: transactions.filter(t => t.status === "Genuine").length, color: "hsl(142 71% 45%)" },
  { name: "Unknown", value: transactions.filter(t => t.status === "Unknown").length, color: "hsl(38 92% 50%)" },
  { name: "Pending", value: transactions.filter(t => t.status === "Pending").length, color: "hsl(215 20% 50%)" },
];

export const kpiData = {
  totalTransactions: transactions.length,
  totalFraud: transactions.filter(t => t.status === "Fraud").length,
  fraudRate: ((transactions.filter(t => t.status === "Fraud").length / transactions.length) * 100).toFixed(1),
  activeRules: fraudRules.filter(r => r.status === "Active").length,
  pendingReview: transactions.filter(t => t.status === "Pending").length,
  totalAmount: transactions.reduce((acc, t) => acc + t.amount, 0),
};
