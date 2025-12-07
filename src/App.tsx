import { useState, lazy, Suspense } from "react";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/clerk-react";
import { AuthDialog } from "./components/auth/AuthDialog";
const DashboardView = lazy(() =>
  import("./pages/DashboardView").then((module) => ({
    default: module.DashboardView,
  }))
);
const ProfessionalDashboardView = lazy(() =>
  import("./pages/ProfessionalDashboardView").then((module) => ({
    default: module.ProfessionalDashboardView,
  }))
);
const AuthView = lazy(() =>
  import("./pages/AuthView").then((module) => ({
    default: module.AuthView,
  }))
);
import type { UserRole } from "./types";
import { Toaster } from "sonner";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-slate-400">Loading...</p>
      </div>
    </div>
  );
}

function AppContent() {
  const { isLoaded, user } = useUser();
  const [authOpen, setAuthOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("resident");

  const currentRole = (user?.publicMetadata?.role as UserRole) ?? selectedRole;

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SignedOut>
        <AuthView
          onRoleSelect={setSelectedRole}
          onGetStarted={() => setAuthOpen(true)}
        />
        <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
      </SignedOut>
      <SignedIn>
        {currentRole === "professional" ? (
          <ProfessionalDashboardView />
        ) : (
          <DashboardView role={currentRole} />
        )}
      </SignedIn>
    </Suspense>
  );
}

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <Toaster position="top-center" />
      <AppContent />
    </ClerkProvider>
  );
}

export default App;
