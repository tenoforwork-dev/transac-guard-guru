import { useState } from "react";
import { ChevronDown, ChevronRight, Search, Filter, Calendar } from "lucide-react";
import { fraudRules, FraudRule } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function RuleHistory() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Disabled">("all");
  const [riskFilter, setRiskFilter] = useState<"all" | "high" | "medium" | "low">("all");

  const filtered = fraudRules.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.createdBy.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    const matchRisk = riskFilter === "all" ||
      (riskFilter === "high" && r.riskThreshold >= 80) ||
      (riskFilter === "medium" && r.riskThreshold >= 60 && r.riskThreshold < 80) ||
      (riskFilter === "low" && r.riskThreshold < 60);
    return matchSearch && matchStatus && matchRisk;
  });

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Rule Break History</h1>
        <p className="page-subtitle">All fraud detection rules created by moderators</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search rules..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-card pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as any)}
          className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Disabled">Disabled</option>
        </select>

        <select
          value={riskFilter}
          onChange={e => setRiskFilter(e.target.value as any)}
          className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="all">All Risk Levels</option>
          <option value="high">High (≥80)</option>
          <option value="medium">Medium (60–79)</option>
          <option value="low">Low (&lt;60)</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 40 }} />
              <th>Rule ID</th>
              <th>Rule Name</th>
              <th>Description</th>
              <th>Risk Threshold</th>
              <th>Created By</th>
              <th>Date Created</th>
              <th>Status</th>
              <th>Triggers</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(rule => (
              <>
                <tr
                  key={rule.id}
                  className="cursor-pointer"
                  onClick={() => setExpandedRow(expandedRow === rule.id ? null : rule.id)}
                >
                  <td className="text-center">
                    {expandedRow === rule.id
                      ? <ChevronDown className="h-4 w-4 text-muted-foreground mx-auto" />
                      : <ChevronRight className="h-4 w-4 text-muted-foreground mx-auto" />
                    }
                  </td>
                  <td className="font-mono text-xs text-primary">{rule.id}</td>
                  <td className="font-medium text-foreground">{rule.name}</td>
                  <td className="text-muted-foreground max-w-xs truncate">{rule.description}</td>
                  <td>
                    <span className={cn(
                      "inline-block rounded-full px-2 py-0.5 text-xs font-semibold",
                      rule.riskThreshold >= 80 ? "badge-fraud" :
                      rule.riskThreshold >= 60 ? "badge-unknown" : "badge-pending"
                    )}>
                      {rule.riskThreshold}
                    </span>
                  </td>
                  <td className="text-muted-foreground text-sm">{rule.createdBy}</td>
                  <td className="text-muted-foreground text-sm">{rule.dateCreated}</td>
                  <td>
                    <span className={rule.status === "Active" ? "badge-active" : "badge-disabled"}>
                      {rule.status}
                    </span>
                  </td>
                  <td className="font-semibold text-foreground">{rule.triggerCount.toLocaleString()}</td>
                </tr>
                {expandedRow === rule.id && (
                  <tr key={`${rule.id}-expanded`}>
                    <td colSpan={9} className="bg-muted/30 px-6 py-4">
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Rule Logic</div>
                          <code className="block rounded-lg bg-background border border-border px-4 py-3 text-sm text-primary font-mono">
                            {rule.logic}
                          </code>
                        </div>
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Conditions</div>
                          <div className="flex flex-wrap gap-2">
                            {rule.conditions.map((c, i) => (
                              <div key={i} className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs">
                                <span className="text-accent font-mono">{c.field}</span>
                                <span className="text-muted-foreground">{c.operator}</span>
                                <span className="text-foreground font-semibold">{c.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">No rules match your filters</div>
        )}
      </div>
    </div>
  );
}
