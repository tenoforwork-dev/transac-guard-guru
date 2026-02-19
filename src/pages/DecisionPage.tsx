import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, HelpCircle, AlertTriangle, User, MapPin, CreditCard, TrendingUp, MessageSquare } from "lucide-react";
import { transactions } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { TransactionStatus } from "@/data/mockData";

const riskInsights: Record<string, string[]> = {
  "Large Amount Transfer": [
    "Amount $12,500 exceeds threshold by 150%",
    "Account unverified for 14 days",
    "No prior large transfers on this account",
    "IP geolocation mismatch with registered address",
  ],
  "Location Mismatch": [
    "Transaction originated 8,400 km from home country",
    "No travel notice registered",
    "First transaction from this region",
    "Device fingerprint matches known fraud pattern",
  ],
  "Night Time Large Transfer": [
    "Transaction at 03:12 AM — outside normal hours",
    "Amount 3x higher than user's average",
    "New payee not in contact list",
    "Session initiated via VPN",
  ],
  "New Device High Value": [
    "Device registered <24 hours ago",
    "No 2FA challenge completed",
    "High-value transaction on first use",
    "Browser fingerprint inconsistent",
  ],
  "Blacklisted Merchant": [
    "Merchant flagged in 3 fraud databases",
    "Previous fraud cases linked to merchant",
    "Unusual transaction pattern",
    "Multiple chargebacks reported",
  ],
};

const historyData = [
  { date: "Feb 10", amount: 120, status: "Genuine" },
  { date: "Feb 12", amount: 340, status: "Genuine" },
  { date: "Feb 14", amount: 890, status: "Genuine" },
  { date: "Feb 16", amount: 4500, status: "Unknown" },
  { date: "Feb 18", amount: 12500, status: "Fraud" },
];

export default function DecisionPage() {
  const [searchParams] = useSearchParams();
  const txnId = searchParams.get("txn");
  const [selectedTxn, setSelectedTxn] = useState(
    txnId ? transactions.find(t => t.id === txnId) : transactions.find(t => t.status === "Pending")
  );
  const [comment, setComment] = useState("");
  const [decision, setDecision] = useState<TransactionStatus | null>(null);
  const [saved, setSaved] = useState(false);

  const pendingTxns = transactions.filter(t => t.status === "Pending" || t.riskScore > 70);
  const insights = selectedTxn?.ruleTriggered ? (riskInsights[selectedTxn.ruleTriggered] || []) : [];

  const handleSave = () => {
    if (!decision) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Decision Review</h1>
        <p className="page-subtitle">Review flagged transactions and make moderation decisions</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Transaction selector */}
        <div className="xl:col-span-1 space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">Pending Review</h3>
          {pendingTxns.map(t => (
            <button
              key={t.id}
              onClick={() => { setSelectedTxn(t); setDecision(null); setSaved(false); }}
              className={cn(
                "w-full text-left rounded-xl border p-3 transition-all",
                selectedTxn?.id === t.id
                  ? "border-primary/40 bg-primary/10"
                  : "border-border bg-card hover:border-border/80 hover:bg-muted/30"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-foreground">{t.id}</span>
                <span className={cn("text-xs font-bold", t.riskScore >= 80 ? "text-destructive" : "text-warning")}>
                  {t.riskScore}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">${t.amount.toLocaleString()}</div>
            </button>
          ))}
        </div>

        {selectedTxn && (
          <>
            {/* Transaction details */}
            <div className="xl:col-span-2 space-y-4">
              <div className="stat-card">
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Transaction Details
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Transaction ID", value: selectedTxn.id },
                    { label: "User ID", value: selectedTxn.userId },
                    { label: "Amount", value: `$${selectedTxn.amount.toLocaleString()}` },
                    { label: "Date", value: selectedTxn.date.split(" ")[0] },
                    { label: "Time", value: selectedTxn.date.split(" ")[1] },
                    { label: "Payment Method", value: selectedTxn.paymentMethod },
                  ].map(item => (
                    <div key={item.label} className="rounded-lg bg-muted/50 p-3">
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                      <div className="text-sm font-semibold text-foreground mt-0.5">{item.value}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 rounded-lg bg-muted/50 p-3">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Location
                  </div>
                  <div className="text-sm font-semibold text-foreground mt-0.5">{selectedTxn.location}</div>
                </div>
                <div className="mt-3 rounded-lg bg-muted/50 p-3">
                  <div className="text-xs text-muted-foreground">Description</div>
                  <div className="text-sm text-foreground mt-0.5">{selectedTxn.description}</div>
                </div>
              </div>

              {/* User history */}
              <div className="stat-card">
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  User Activity History
                </h3>
                <div className="space-y-2">
                  {historyData.map((h, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <span className="text-xs text-muted-foreground">{h.date}</span>
                      <span className="text-sm font-medium text-foreground">${h.amount.toLocaleString()}</span>
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        h.status === "Genuine" ? "badge-genuine" :
                        h.status === "Fraud" ? "badge-fraud" : "badge-unknown"
                      )}>{h.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="stat-card">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Moderator Notes
                </h3>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Add your analysis and reasoning here..."
                  rows={4}
                  className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            {/* Risk analysis panel */}
            <div className="xl:col-span-1 space-y-4">
              {/* Risk score */}
              <div className="stat-card">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Risk Score
                </h3>
                <div className="relative flex h-24 items-center justify-center">
                  <div className={cn(
                    "text-5xl font-black",
                    selectedTxn.riskScore >= 85 ? "text-destructive" :
                    selectedTxn.riskScore >= 65 ? "text-warning" : "text-success"
                  )}>
                    {selectedTxn.riskScore}
                  </div>
                  <div className="absolute bottom-0 text-xs text-muted-foreground">/100</div>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      selectedTxn.riskScore >= 85 ? "bg-destructive" :
                      selectedTxn.riskScore >= 65 ? "bg-warning" : "bg-success"
                    )}
                    style={{ width: `${selectedTxn.riskScore}%` }}
                  />
                </div>
                {selectedTxn.ruleTriggered && (
                  <div className="mt-3 rounded-lg bg-primary/10 border border-primary/20 p-2.5">
                    <div className="text-xs text-muted-foreground">Triggered Rule</div>
                    <div className="text-xs font-semibold text-primary mt-0.5">{selectedTxn.ruleTriggered}</div>
                  </div>
                )}
              </div>

              {/* AI Insights */}
              {insights.length > 0 && (
                <div className="stat-card">
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    AI Risk Factors
                  </h3>
                  <div className="space-y-2">
                    {insights.map((insight, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-warning flex-shrink-0 mt-1" />
                        {insight}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Decision buttons */}
              <div className="stat-card">
                <h3 className="text-sm font-semibold text-foreground mb-3">Make Decision</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setDecision("Fraud")}
                    className={cn(
                      "w-full flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-all",
                      decision === "Fraud"
                        ? "border-destructive bg-destructive/20 text-destructive"
                        : "border-border text-muted-foreground hover:border-destructive/50 hover:bg-destructive/5 hover:text-destructive"
                    )}
                  >
                    <XCircle className="h-4 w-4" />
                    Mark as Fraud
                  </button>
                  <button
                    onClick={() => setDecision("Genuine")}
                    className={cn(
                      "w-full flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-all",
                      decision === "Genuine"
                        ? "border-success bg-success/20 text-success"
                        : "border-border text-muted-foreground hover:border-success/50 hover:bg-success/5 hover:text-success"
                    )}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Mark as Genuine
                  </button>
                  <button
                    onClick={() => setDecision("Unknown")}
                    className={cn(
                      "w-full flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-all",
                      decision === "Unknown"
                        ? "border-warning bg-warning/20 text-warning"
                        : "border-border text-muted-foreground hover:border-warning/50 hover:bg-warning/5 hover:text-warning"
                    )}
                  >
                    <HelpCircle className="h-4 w-4" />
                    Mark as Unknown
                  </button>
                </div>

                <button
                  onClick={handleSave}
                  disabled={!decision}
                  className="mt-4 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                >
                  {saved ? "✓ Decision Saved!" : "Save Decision"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
