import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";

type Role = "Moderator" | "Admin";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [role, setRole] = useState<Role>("Moderator");

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Header role={role} onRoleChange={setRole} />
        <main className="flex-1 overflow-auto">
          <div className="p-6 animate-fade-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
