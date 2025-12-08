import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Loader2, Shield, Briefcase, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import type { UserRole } from "../../types";

export function RoleToggle() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const currentRole = (user?.unsafeMetadata?.role as UserRole) || "resident";

  const handleRoleSwitch = async () => {
    if (!user) return;

    const newRole: UserRole =
      currentRole === "resident" ? "professional" : "resident";

    setIsLoading(true);
    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          role: newRole,
        },
      });

      toast.success(
        `Switched to ${
          newRole === "resident" ? "Resident" : "Professional"
        } mode`,
        {
          description: "Reloading dashboard...",
        }
      );

      // Reload to apply new role
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      console.error("Failed to switch role:", error);
      toast.error("Failed to switch role. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Account Mode
        </CardTitle>
        <CardDescription>
          Switch between Resident and Professional modes based on your needs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Role Display */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50 border border-border">
          <div className="flex items-center gap-3">
            {currentRole === "resident" ? (
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-blue-500" />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-emerald-500" />
              </div>
            )}
            <div>
              <p className="font-semibold text-foreground">
                {currentRole === "resident"
                  ? "Resident Mode"
                  : "Professional Mode"}
              </p>
              <p className="text-sm text-muted-foreground">
                {currentRole === "resident"
                  ? "Simplified dashboard for daily monitoring"
                  : "Advanced tools for research and analysis"}
              </p>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
            ACTIVE
          </div>
        </div>

        {/* Switch Button */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowRight className="h-4 w-4" />
            <span>
              Switch to{" "}
              <span className="font-semibold text-foreground">
                {currentRole === "resident" ? "Professional" : "Resident"}
              </span>{" "}
              mode to access{" "}
              {currentRole === "resident"
                ? "advanced research tools, data export, and API access"
                : "simplified health-focused interface"}
            </span>
          </div>

          <Button
            onClick={handleRoleSwitch}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Switching...
              </>
            ) : (
              <>
                Switch to{" "}
                {currentRole === "resident" ? "Professional" : "Resident"} Mode
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Info Note */}
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <strong>Note:</strong> Your data and preferences will be preserved
          when switching modes. You can switch back anytime from your profile
          settings.
        </div>
      </CardContent>
    </Card>
  );
}
