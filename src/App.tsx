import { lazy, Suspense, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/clerk-react";
import { Toaster } from "sonner";
import { AuthDialog } from "./components/auth/AuthDialog";
import type { UserRole } from "./types";

// Lazy load pages
const AuthView = lazy(() =>
  import("./pages/AuthView").then((m) => ({ default: m.AuthView }))
);
const ResidentDashboard = lazy(() =>
  import("./pages/resident/Dashboard").then((m) => ({ default: m.Dashboard }))
);
const MapView = lazy(() =>
  import("./pages/resident/MapView").then((m) => ({ default: m.MapView }))
);
const TrendsView = lazy(() =>
  import("./pages/resident/TrendsView").then((m) => ({ default: m.TrendsView }))
);
const NotificationsView = lazy(() =>
  import("./pages/resident/NotificationsView").then((m) => ({
    default: m.NotificationsView,
  }))
);
const ProfileView = lazy(() =>
  import("./pages/ProfileView").then((m) => ({ default: m.ProfileView }))
);

const ProfessionalDashboard = lazy(() =>
  import("./pages/professional/Dashboard").then((m) => ({
    default: m.Dashboard,
  }))
);
const RiskCalculator = lazy(() =>
  import("./pages/professional/RiskCalculator").then((m) => ({
    default: m.RiskCalculator,
  }))
);
const DataUpload = lazy(() =>
  import("./pages/professional/DataUpload").then((m) => ({
    default: m.DataUpload,
  }))
);
const Reports = lazy(() =>
  import("./pages/professional/Reports").then((m) => ({ default: m.Reports }))
);

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function ProtectedRoutes() {
  const { user } = useUser();
  const role = (user?.publicMetadata?.role as string) || "resident";

  return (
    <Routes>
      {/* Resident Routes */}
      {role === "resident" && (
        <>
          <Route path="/" element={<ResidentDashboard />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/trends" element={<TrendsView />} />
          <Route path="/notifications" element={<NotificationsView />} />
          <Route path="/profile" element={<ProfileView />} />
        </>
      )}

      {/* Professional Routes */}
      {role === "professional" && (
        <>
          <Route path="/" element={<ProfessionalDashboard />} />
          <Route path="/risk-calculator" element={<RiskCalculator />} />
          <Route path="/data-upload" element={<DataUpload />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<ProfileView />} />
        </>
      )}

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function AppContent() {
  const [authOpen, setAuthOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("resident");

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SignedOut>
        <Routes>
          <Route
            path="*"
            element={
              <>
                <AuthView
                  onRoleSelect={setSelectedRole}
                  onGetStarted={() => setAuthOpen(true)}
                />
                <AuthDialog
                  open={authOpen}
                  onOpenChange={setAuthOpen}
                  defaultRole={selectedRole}
                />
              </>
            }
          />
        </Routes>
      </SignedOut>
      <SignedIn>
        <ProtectedRoutes />
      </SignedIn>
    </Suspense>
  );
}

import { ThemeProvider } from "./contexts/ThemeProvider";

function App() {
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      appearance={{
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
      }}
    >
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Toaster position="top-center" />
          <AppContent />
        </BrowserRouter>
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default App;
