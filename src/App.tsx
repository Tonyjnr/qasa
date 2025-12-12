import { lazy, Suspense, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";
import { AuthDialog } from "./components/auth/AuthDialog";
import { OnboardingFlow } from "./components/onboarding/OnboardingFlow";
import { MetadataManager } from "./components/shared/MetadataManager"; // Import here
import { ThemeProvider, useTheme } from "./contexts/ThemeProvider";
import APIDebugChecker from "./components/APIDebugChecker"; // Add this import
import type { UserRole } from "./types";

// ... (Lazy imports remain the same)
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

const PUBLISHABLE_KEY = process.env.VITE_CLERK_PUBLISHABLE_KEY;

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
      <Route path="/debug" element={<APIDebugChecker />} />
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

  const handleOnboardingComplete = async (role: UserRole) => {
    if (user) {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          role,
          onboardingCompleted: true,
        },
      });
      window.location.reload(); // Simple way to ensure fresh state
    }
  };

  if (!isLoaded) return <LoadingSpinner />;

  // Derived state for onboarding
  const needsOnboarding =
    isSignedIn && user && !user.unsafeMetadata?.onboardingCompleted;

  if (needsOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <>
      <MetadataManager /> {/* Add MetadataManager here */}
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
    </>
  );
}

const ClerkProviderWithTheme = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { theme } = useTheme();

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      appearance={{
        baseTheme:
          theme === "dark" ||
          (theme === "system" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches)
            ? dark
            : undefined,
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
};

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <ClerkProviderWithTheme>
        <BrowserRouter>
          <Toaster position="top-center" />
          <AppContent />
        </BrowserRouter>
      </ClerkProviderWithTheme>
    </ThemeProvider>
  );
}

export default App;
