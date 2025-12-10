import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import type { UserRole } from "../../types";

export function MetadataManager() {
  const { user, isSignedIn } = useUser();
  const role = user?.unsafeMetadata?.role as UserRole | undefined;

  useEffect(() => {
    // 1. Update Title
    if (!isSignedIn) {
      document.title = "Qasa";
    } else if (role === "professional") {
      document.title = "Qasa | Professional";
    } else {
      document.title = "Qasa | Resident";
    }

    // 2. Update Favicon
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (link) {
      if (!isSignedIn) {
        // Default Vite logo or Qasa brand icon
        link.href = "/vite.svg";
      } else if (role === "professional") {
        // Briefcase emoji for Professional
        link.href =
          "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💼</text></svg>";
      } else {
        // House emoji for Resident
        link.href =
          "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏠</text></svg>";
      }
    }
  }, [isSignedIn, role]);

  return null; // Headless component
}
