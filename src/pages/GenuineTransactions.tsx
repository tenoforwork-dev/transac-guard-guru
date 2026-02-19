import { useState } from "react";
import { Search, Download, CheckCircle } from "lucide-react";
import { genuineTransactions } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function GenuineTransactions() {
  const [search, setSearch] = useState("");
  const [amountMin, setAmountMin] = useState("");
  const [amountMax, setAmountMax] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");

  const filtered = genuineTransactions.filter(t => {
    const matchSearch = t.id.includes(search) || t.userId.includes(search) || t.location.toLowerCase().includes(search.toLowerCase());
    const matchMin = !amountMin || t.amount >= Number(amountMin);
    const matchMax = !amountMax || t.amount <= Number(amountMax);
    const matchMethod = methodFilter === "all" || t.paymentMethod === methodFilter;
    return matchSearch && matchMin && matchMax && matchMethod;
  });

  const exportCSV = () => {
    const headers = ["ID", "User ID", "Amount", "Date", "Location", "Payment Method", "Risk Score", "Status"];
    const rows = filtered.map(t => [t.id, t.userId, t.amount, t.date, t.location, t.paymentMethod, t.riskScore, t.status]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "genuine_transactions.csv";
    a.click();
  };

  const methods = Array.from(new Set(genuineTransactions.map(t => t.paymentMethod)));

  return (
    <div className="space-y-6">
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Genuine Transactions</h1>
          <p className="page-subtitle">All transactions verified as legitimate</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Verified Transactions", value: genuineTransactions.length, icon: CheckCircle },
          { label: "Total Volume", value: `$${genuineTransactions.reduce((a, t) => a + t.amount, 0).toLocaleString()}` },
          { label: "Avg. Amount", value: `$${Math.round(genuineTransactions.reduce((a, t) => a + t.amount, 0) / genuineTransactions.length).toLocaleString()}` },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center gap-2">
              {s.icon && <s.icon className="h-4 w-4 text-success" />}
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </div>
            <div className="text-2xl font-bold text-foreground mt-2">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search by ID, user, location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-card pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <input
          type="number"
          placeholder="Min amount"
          value={amountMin}
          onChange={e => setAmountMin(e.target.value)}
          className="w-32 rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <input
          type="number"
          placeholder="Max amount"
          value={amountMax}
          onChange={e => setAmountMax(e.target.value)}
          className="w-32 rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <select
          value={methodFilter}
          onChange={e => setMethodFilter(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="all">All Methods</option>
          {methods.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>User ID</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Location</th>
              <th>Payment Method</th>
              <th>Risk Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id}>
                <td className="font-mono text-xs text-primary">{t.id}</td>
                <td className="text-muted-foreground text-sm">{t.userId}</td>
                <td className="font-semibold text-foreground">${t.amount.toLocaleString()}</td>
                <td className="text-muted-foreground text-sm">{t.date.split(" ")[0]}</td>
                <td className="text-muted-foreground text-sm">{t.location}</td>
                <td>
                  <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {t.paymentMethod}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-12 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-success" style={{ width: `${t.riskScore}%` }} />
                    </div>
                    <span className="text-xs text-success">{t.riskScore}</span>
                  </div>
                </td>
                <td><span className="badge-genuine">Approved</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">No transactions match your filters</div>
        )}
      </div>
    </div>
  );
}
