import { UserProfile } from "@clerk/clerk-react";
import { RoleToggle } from "../components/profile/RoleToggle";
import { AlertSettings } from "../components/professional/alerts/AlertSettings";
import { dark } from "@clerk/themes";

export const ProfileView = () => {
  return (
    <div className="min-h-screen w-full bg-background p-4 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Clerk User Profile */}
        <div className="lg:col-span-2">
          <UserProfile
            path="/profile"
            routing="path"
            appearance={{
              baseTheme: dark,
              elements: {
                rootBox: "w-full",
                card: "bg-card border border-border shadow-none rounded-xl",
                navbar: "hidden",
                navbarMobileMenuButton: "hidden",
                headerTitle: "text-foreground font-bold",
                headerSubtitle: "text-muted-foreground",
                formButtonPrimary:
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                formFieldInput: "bg-background border-input text-foreground",
                footer: "hidden",
              },
            }}
          />
        </div>

        {/* Custom Settings Column */}
        <div className="space-y-6">
          <RoleToggle />

          {/* New Alert Settings */}
          <AlertSettings />

          {/* Add more custom settings components here if needed */}
        </div>
      </div>
    </div>
  );
};
