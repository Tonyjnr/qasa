import { useState } from "react";
import type { ViewState, UserRole } from "./types";
import { AuthView } from "./pages/AuthView";
import { DashboardView } from "./pages/DashboardView";

function App() {
  const [currentView, setCurrentView] = useState<ViewState>("AUTH");
  const [userRole, setUserRole] = useState<UserRole>("resident");

  // Simple Router
  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setCurrentView("DASHBOARD");
  };

  const handleLogout = () => {
    setCurrentView("AUTH");
  };

  return (
    <>
      {currentView === "AUTH" && <AuthView onLogin={handleLogin} />}
      {currentView === "DASHBOARD" && (
        <DashboardView role={userRole} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;
