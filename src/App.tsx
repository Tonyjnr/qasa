import { lazy, Suspense, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/clerk-react";
import { Toaster } from "sonner";
import { AuthDialog } from "./components/auth/AuthDialog";
import { OnboardingFlow } from "./components/onboarding/OnboardingFlow";
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
    default: m.default,
  }))
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
  const role = (user?.unsafeMetadata?.role as string) || "resident";

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
  const { user, isLoaded, isSignedIn } = useUser();
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      const hasCompletedOnboarding = user.unsafeMetadata?.onboardingCompleted;

      if (!hasCompletedOnboarding) {
        setNeedsOnboarding(true);
      }
    }
  }, [isLoaded, user]);

  const handleOnboardingComplete = async (role: UserRole) => {
    if (user) {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          role,
          onboardingCompleted: true,
        },
      });
      setNeedsOnboarding(false);
    }
  };

  if (!isLoaded) return <LoadingSpinner />;

  if (isSignedIn && needsOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

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
