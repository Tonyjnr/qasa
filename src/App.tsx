import { useState } from "react";
import { SignedIn, SignedOut, useClerk } from "@clerk/clerk-react";
import type { UserRole } from "./types";
import { AuthView } from "./pages/AuthView";
import { DashboardView } from "./pages/DashboardView";

function App() {
  const [userRole, setUserRole] = useState<UserRole>("resident");
  const { signOut } = useClerk();

  return (
    <>
      <SignedOut>
        <AuthView onRoleSelect={setUserRole} />
      </SignedOut>
      <SignedIn>
        <DashboardView role={userRole} onLogout={() => signOut()} />
      </SignedIn>
    </>
  );
}

export default App;
