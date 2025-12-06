import { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AuthDialog } from "./components/auth/AuthDialog";
import { DashboardView } from "./pages/DashboardView";
import { AuthView } from "./pages/AuthView";
import type { UserRole } from "./types";
import { Toaster } from "sonner";

function AppContent() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("resident");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <AuthView
          onRoleSelect={setUserRole}
          onGetStarted={() => setAuthOpen(true)}
        />
        <AuthDialog
          open={authOpen}
          onOpenChange={setAuthOpen}
          onSuccess={() => setAuthOpen(false)}
        />
      </>
    );
  }

  return <DashboardView role={userRole} onLogout={logout} />;
}

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" />
      <AppContent />
    </AuthProvider>
  );
}

export default App;
