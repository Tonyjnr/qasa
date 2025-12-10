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

    // 2. Update Favicon (always use qasa.ico globally)
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (link) {
      link.href = "/qasa.ico";
    }
  }, [isSignedIn, role]);

  return null; // Headless component
}
