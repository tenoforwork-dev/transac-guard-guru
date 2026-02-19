import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Clock, ArrowRight, Eye, TrendingUp } from "lucide-react";
import { fraudAlerts, transactions } from "@/data/mockData";
import { cn } from "@/lib/utils";

const getRiskColor = (score: number) => {
  if (score >= 85) return "alert-card-high";
  if (score >= 65) return "alert-card-medium";
  return "alert-card-low";
};

const getRiskLabel = (score: number) => {
  if (score >= 85) return { label: "Critical", cls: "badge-fraud" };
  if (score >= 65) return { label: "High", cls: "badge-unknown" };
  return { label: "Medium", cls: "badge-pending" };
};

export default function FraudNotifications() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "critical" | "high">("all");

  const filtered = fraudAlerts.filter(a => {
    if (filter === "critical") return a.riskScore >= 85;
    if (filter === "high") return a.riskScore >= 65 && a.riskScore < 85;
    return true;
  }).sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div className="space-y-6">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Fraud Alerts</h1>
          <p className="page-subtitle">Real-time fraud transaction notifications</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
          <span className="text-sm font-medium text-destructive">Live monitoring active</span>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Critical (≥85)", count: fraudAlerts.filter(a => a.riskScore >= 85).length, color: "text-destructive", bg: "bg-destructive/10 border-destructive/30" },
          { label: "High (65–84)", count: fraudAlerts.filter(a => a.riskScore >= 65 && a.riskScore < 85).length, color: "text-warning", bg: "bg-warning/10 border-warning/30" },
          { label: "Medium (<65)", count: fraudAlerts.filter(a => a.riskScore < 65).length, color: "text-muted-foreground", bg: "bg-muted border-border" },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.bg}`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["all", "critical", "high"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors",
              filter === f
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {f === "all" ? "All Alerts" : `${f.charAt(0).toUpperCase() + f.slice(1)} Risk`}
          </button>
        ))}
      </div>

      {/* Alert cards */}
      <div className="space-y-3">
        {filtered.map((alert) => {
          const risk = getRiskLabel(alert.riskScore);
          return (
            <div key={alert.id} className={getRiskColor(alert.riskScore)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={cn(
                    "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg mt-0.5",
                    alert.riskScore >= 85 ? "bg-destructive/20 text-destructive" :
                    alert.riskScore >= 65 ? "bg-warning/20 text-warning" :
                    "bg-muted text-muted-foreground"
                  )}>
                    <AlertTriangle className="h-4 w-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-foreground">{alert.transactionId}</span>
                      <span className={risk.cls}>{risk.label} Risk</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground flex-wrap">
                      <span>User: <span className="text-foreground">{alert.userId}</span></span>
                      <span>Amount: <span className="text-foreground font-medium">${alert.amount.toLocaleString()}</span></span>
                      <span>Location: <span className="text-foreground">{alert.location}</span></span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 text-xs">
                      <span className="text-muted-foreground">Rule:</span>
                      <span className="bg-primary/15 text-primary px-2 py-0.5 rounded-full">{alert.triggeredRule}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className={cn(
                      "text-xl font-bold",
                      alert.riskScore >= 85 ? "text-destructive" :
                      alert.riskScore >= 65 ? "text-warning" : "text-muted-foreground"
                    )}>{alert.riskScore}</span>
                    <span className="text-xs text-muted-foreground">/ 100</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{alert.timeDetected.split(" ")[1]}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/decision?txn=${alert.transactionId}`)}
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity"
                  >
                    <Eye className="h-3 w-3" />
                    Review
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
