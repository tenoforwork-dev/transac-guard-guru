import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { TrendingUp, AlertTriangle, CheckCircle, Shield, Clock, DollarSign } from "lucide-react";
import { kpiData, fraudVolumeData, ruleBreakData, distributionData } from "@/data/mockData";

const KPICard = ({
  title, value, subtitle, icon: Icon, trend, color
}: {
  title: string; value: string | number; subtitle: string;
  icon: React.ElementType; trend?: string; color: string;
}) => (
  <div className="stat-card">
    <div className="flex items-start justify-between mb-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      {trend && (
        <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">{trend}</span>
      )}
    </div>
    <div className="text-2xl font-bold text-foreground">{value}</div>
    <div className="text-sm font-medium text-foreground mt-0.5">{title}</div>
    <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-xl">
        <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-sm font-semibold text-foreground">{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [fraudPeriod, setFraudPeriod] = useState<"daily" | "weekly" | "monthly">("daily");

  const getFilteredData = () => {
    if (fraudPeriod === "weekly") {
      return [
        { date: "Week 1", count: 18 },
        { date: "Week 2", count: 24 },
        { date: "Week 3", count: 31 },
        { date: "Week 4", count: 45 },
      ];
    }
    if (fraudPeriod === "monthly") {
      return [
        { date: "Nov", count: 89 },
        { date: "Dec", count: 124 },
        { date: "Jan", count: 108 },
        { date: "Feb", count: 142 },
      ];
    }
    return fraudVolumeData;
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Dashboard Analytics</h1>
        <p className="page-subtitle">Real-time fraud monitoring overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Total Transactions"
          value={kpiData.totalTransactions}
          subtitle="Last 30 days"
          icon={DollarSign}
          color="bg-primary/15 text-primary"
        />
        <KPICard
          title="Fraud Detected"
          value={kpiData.totalFraud}
          subtitle="Confirmed fraud cases"
          icon={AlertTriangle}
          color="bg-destructive/15 text-destructive"
        />
        <KPICard
          title="Fraud Rate"
          value={`${kpiData.fraudRate}%`}
          subtitle="Of total transactions"
          icon={TrendingUp}
          color="bg-warning/15 text-warning"
        />
        <KPICard
          title="Active Rules"
          value={kpiData.activeRules}
          subtitle="Detection rules active"
          icon={Shield}
          color="bg-accent/15 text-accent"
        />
        <KPICard
          title="Pending Review"
          value={kpiData.pendingReview}
          subtitle="Awaiting decision"
          icon={Clock}
          color="bg-muted text-muted-foreground"
        />
        <KPICard
          title="Total Volume"
          value={`$${(kpiData.totalAmount / 1000).toFixed(0)}K`}
          subtitle="Monitored transactions"
          icon={CheckCircle}
          color="bg-success/15 text-success"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fraud Volume Chart */}
        <div className="stat-card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Fraud Volume</h2>
              <p className="text-xs text-muted-foreground">Number of fraud cases over time</p>
            </div>
            <div className="flex gap-1 rounded-lg border border-border p-1">
              {(["daily", "weekly", "monthly"] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setFraudPeriod(period)}
                  className={`rounded px-3 py-1 text-xs font-medium capitalize transition-colors ${
                    fraudPeriod === period
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={getFilteredData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="count"
                name="Fraud Cases"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution Pie */}
        <div className="stat-card">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-foreground">Status Distribution</h2>
            <p className="text-xs text-muted-foreground">Transaction breakdown</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {distributionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-semibold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rule Break Chart */}
      <div className="stat-card">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-foreground">Rule Break Detection</h2>
          <p className="text-xs text-muted-foreground">Number of times each rule was triggered</p>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={ruleBreakData} margin={{ bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              angle={-20}
              textAnchor="end"
              interval={0}
            />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" name="Triggers" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
