import { useState } from "react";
import { Plus, Trash2, Play, Zap, TrendingUp, CheckCircle, AlertTriangle, Power, PowerOff } from "lucide-react";
import { fraudRules } from "@/data/mockData";
import { cn } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const FIELD_OPTIONS = ["amount", "location", "payment_method", "transaction_count_1hr", "hour", "new_device", "account_verified", "merchant_category", "ip_is_vpn"];
const OPERATOR_OPTIONS = ["=", "!=", ">", "<", ">=", "<=", "contains", "in"];

interface Condition {
  id: number;
  field: string;
  operator: string;
  value: string;
  combiner: "AND" | "OR";
}

const aiSuggestion = {
  show: true,
  message: "Reducing the 'Large Amount Transfer' threshold from $5,000 to $4,200 increases fraud detection by 12% with only 3% more false positives.",
  improvement: 12,
  falsePositive: 3,
  currentThreshold: 5000,
  suggestedThreshold: 4200,
  beforeData: [
    { label: "Detected", current: 68, suggested: 78 },
    { label: "Missed", current: 32, suggested: 22 },
    { label: "False Pos.", current: 8, suggested: 11 },
  ],
};

export default function RuleCustomization() {
  const [rules, setRules] = useState(fraudRules.map(r => ({ ...r })));
  const [ruleName, setRuleName] = useState("");
  const [ruleDesc, setRuleDesc] = useState("");
  const [riskWeight, setRiskWeight] = useState(70);
  const [conditions, setConditions] = useState<Condition[]>([
    { id: 1, field: "amount", operator: ">", value: "", combiner: "AND" },
  ]);
  const [showAI, setShowAI] = useState(false);
  const [aiLoading, setAILoading] = useState(false);
  const [showAISuggestion, setShowAISuggestion] = useState(false);
  const [suggestionApplied, setSuggestionApplied] = useState(false);

  const addCondition = () => {
    setConditions(prev => [...prev, {
      id: Date.now(),
      field: "amount",
      operator: ">",
      value: "",
      combiner: "AND",
    }]);
  };

  const removeCondition = (id: number) => {
    setConditions(prev => prev.filter(c => c.id !== id));
  };

  const updateCondition = (id: number, field: keyof Condition, value: string) => {
    setConditions(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const toggleRuleStatus = (ruleId: string) => {
    setRules(prev => prev.map(r =>
      r.id === ruleId ? { ...r, status: r.status === "Active" ? "Disabled" : "Active" } : r
    ));
  };

  const handleAnalyze = () => {
    setAILoading(true);
    setTimeout(() => {
      setAILoading(false);
      setShowAISuggestion(true);
    }, 2000);
  };

  const handleApplySuggestion = () => {
    setSuggestionApplied(true);
    setRules(prev => prev.map(r =>
      r.id === "RULE-001" ? { ...r, riskThreshold: 82 } : r
    ));
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Rule Customization</h1>
        <p className="page-subtitle">Create, edit, and manage fraud detection rules</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Rule builder */}
        <div className="xl:col-span-2 space-y-4">
          <div className="stat-card">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Plus className="h-4 w-4 text-primary" />
              Build New Rule
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Rule Name</label>
                <input
                  value={ruleName}
                  onChange={e => setRuleName(e.target.value)}
                  placeholder="e.g., High Value Crypto"
                  className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Risk Score Weight: {riskWeight}</label>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={riskWeight}
                  onChange={e => setRiskWeight(Number(e.target.value))}
                  className="w-full mt-2 accent-primary"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Description</label>
              <input
                value={ruleDesc}
                onChange={e => setRuleDesc(e.target.value)}
                placeholder="Describe what this rule detects..."
                className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Conditions */}
            <div className="space-y-2 mb-4">
              <label className="text-xs font-medium text-muted-foreground block">Conditions</label>
              {conditions.map((c, i) => (
                <div key={c.id} className="flex items-center gap-2 flex-wrap">
                  {i > 0 && (
                    <select
                      value={c.combiner}
                      onChange={e => updateCondition(c.id, "combiner", e.target.value)}
                      className="rounded-lg border border-primary/30 bg-primary/10 px-2 py-2 text-xs font-bold text-primary focus:outline-none"
                    >
                      <option>AND</option>
                      <option>OR</option>
                    </select>
                  )}
                  <select
                    value={c.field}
                    onChange={e => updateCondition(c.id, "field", e.target.value)}
                    className="flex-1 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {FIELD_OPTIONS.map(f => <option key={f}>{f}</option>)}
                  </select>
                  <select
                    value={c.operator}
                    onChange={e => updateCondition(c.id, "operator", e.target.value)}
                    className="w-24 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {OPERATOR_OPTIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                  <input
                    value={c.value}
                    onChange={e => updateCondition(c.id, "value", e.target.value)}
                    placeholder="Value"
                    className="w-28 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  {conditions.length > 1 && (
                    <button onClick={() => removeCondition(c.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addCondition}
                className="flex items-center gap-1.5 text-sm text-primary hover:opacity-80 transition-opacity"
              >
                <Plus className="h-3.5 w-3.5" /> Add Condition
              </button>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                Save Rule
              </button>
              <button className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                Preview
              </button>
            </div>
          </div>

          {/* Existing rules list */}
          <div className="stat-card">
            <h3 className="text-sm font-semibold text-foreground mb-4">Existing Rules</h3>
            <div className="space-y-2">
              {rules.map(rule => (
                <div
                  key={rule.id}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-3 transition-all",
                    rule.status === "Active" ? "border-border bg-muted/20" : "border-border/50 bg-muted/10 opacity-60"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground truncate">{rule.name}</span>
                      <span className={rule.status === "Active" ? "badge-active" : "badge-disabled"}>
                        {rule.status}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">Threshold: {rule.riskThreshold} · {rule.triggerCount} triggers</div>
                  </div>
                  <button
                    onClick={() => toggleRuleStatus(rule.id)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                      rule.status === "Active"
                        ? "border-border text-muted-foreground hover:border-destructive/50 hover:text-destructive"
                        : "border-success/30 text-success hover:bg-success/10"
                    )}
                  >
                    {rule.status === "Active" ? <PowerOff className="h-3 w-3" /> : <Power className="h-3 w-3" />}
                    {rule.status === "Active" ? "Disable" : "Enable"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Suggestion Panel */}
        <div className="space-y-4">
          <div className="stat-card border border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">AI Rule Assistant</h3>
                <p className="text-xs text-muted-foreground">Back-test rules on historical data</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-3">
              Analyze your existing rules against past transactions to find optimal thresholds and reduce false positives.
            </p>

            <button
              onClick={handleAnalyze}
              disabled={aiLoading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {aiLoading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Analyze Past Data
                </>
              )}
            </button>
          </div>

          {showAISuggestion && (
            <div className="stat-card border border-accent/30 animate-fade-up">
              <div className="flex items-start gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-foreground">AI Suggestion</h4>
                  <p className="text-xs text-muted-foreground mt-1">{aiSuggestion.message}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="rounded-lg bg-success/10 border border-success/20 p-2.5 text-center">
                  <div className="text-lg font-bold text-success">+{aiSuggestion.improvement}%</div>
                  <div className="text-xs text-muted-foreground">Detection Rate</div>
                </div>
                <div className="rounded-lg bg-warning/10 border border-warning/20 p-2.5 text-center">
                  <div className="text-lg font-bold text-warning">+{aiSuggestion.falsePositive}%</div>
                  <div className="text-xs text-muted-foreground">False Positives</div>
                </div>
              </div>

              <div className="mb-3">
                <div className="text-xs font-medium text-muted-foreground mb-2">Before vs After</div>
                <ResponsiveContainer width="100%" height={130}>
                  <BarChart data={aiSuggestion.beforeData} barSize={16}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                    <Bar dataKey="current" name="Current" fill="hsl(var(--muted-foreground))" radius={[3,3,0,0]} />
                    <Bar dataKey="suggested" name="Suggested" fill="hsl(var(--primary))" radius={[3,3,0,0]} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: "10px" }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between text-xs mb-3">
                <span className="text-muted-foreground">Threshold: ${aiSuggestion.currentThreshold.toLocaleString()}</span>
                <span className="text-primary">→</span>
                <span className="text-primary font-semibold">${aiSuggestion.suggestedThreshold.toLocaleString()}</span>
              </div>

              {!suggestionApplied ? (
                <button
                  onClick={handleApplySuggestion}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground hover:opacity-90 transition-opacity"
                >
                  <TrendingUp className="h-4 w-4" />
                  Apply Suggestion
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 rounded-lg bg-success/15 border border-success/30 px-4 py-2.5 text-sm font-semibold text-success">
                  <CheckCircle className="h-4 w-4" />
                  Suggestion Applied!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
