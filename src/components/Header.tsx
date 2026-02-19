import { Bell, User, ChevronDown, Shield } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { fraudAlerts } from "@/data/mockData";

type Role = "Moderator" | "Admin";

interface HeaderProps {
  role: Role;
  onRoleChange: (role: Role) => void;
}

export function Header({ role, onRoleChange }: HeaderProps) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const unreviewed = fraudAlerts.filter(a => !a.reviewed).length;

  return (
    <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="text-sm text-muted-foreground">
        <span className="text-foreground font-medium">FraudGuard AI</span>
        <span className="mx-2 text-border">·</span>
        <span>Real-time fraud monitoring platform</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors">
          <Bell className="h-4 w-4 text-muted-foreground" />
          {unreviewed > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-bold animate-pulse-glow">
              {unreviewed}
            </span>
          )}
        </button>

        {/* Role switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted transition-colors"
          >
            <div className={cn(
              "h-2 w-2 rounded-full",
              role === "Admin" ? "bg-destructive" : "bg-primary"
            )} />
            <span className="text-foreground font-medium">{role}</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 top-full mt-1 w-36 rounded-lg border border-border bg-card shadow-xl z-50 overflow-hidden">
              {(["Moderator", "Admin"] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => { onRoleChange(r); setShowRoleMenu(false); }}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2.5 text-sm transition-colors",
                    role === r ? "bg-primary/15 text-primary" : "text-foreground hover:bg-muted"
                  )}
                >
                  <div className={cn("h-2 w-2 rounded-full", r === "Admin" ? "bg-destructive" : "bg-primary")} />
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User avatar */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 border border-primary/30">
          <User className="h-4 w-4 text-primary" />
        </div>
      </div>
    </header>
  );
}
