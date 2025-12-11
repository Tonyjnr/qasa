/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import type { UserRole } from "../../types";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultRole: UserRole;
}

export function AuthDialog({
  open,
  onOpenChange,
  defaultRole,
}: AuthDialogProps) {
  const [mode, setMode] = useState<"login" | "signup">("signup");

  const commonAppearance = {
    baseTheme: dark,
    layout: {
      socialButtonsPlacement: "top" as const,
      socialButtonsVariant: "blockButton" as const,
    },
    variables: {
      borderRadius: "30px",
      colorPrimary: "#ffffff",
      colorBackground: "#181818",
      colorText: "#ffffff",
      colorInputBackground: "#141414c5",
      colorInputText: "#ffffff",
      fontFamily: "inherit",
    },
    elements: {
      footer: "hidden",
      footerAction: "hidden",
      card: "bg-[#181818] border border-slate-800 shadow-2xl",
      headerTitle: "text-white font-bold text-2xl mb-1",
      headerSubtitle: "text-slate-400 text-sm",
      socialButtonsBlockButton:
        "border border-slate-700 hover:bg-slate-800 text-white transition-colors h-12",
      socialButtonsBlockButtonText: "font-medium",
      dividerLine: "bg-slate-700",
      dividerText: "text-slate-500 text-xs uppercase tracking-wider",
      formFieldInput:
        "bg-slate-900 border border-slate-600 text-white h-12 focus:border-white focus:ring-0 transition-colors",
      formButtonPrimary:
        "bg-white text-slate-900 hover:bg-slate-200 h-12 font-bold transition-colors shadow-none normal-case",
      formFieldLabel: "text-slate-300 font-medium ml-2 mb-1.5",
    },
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] p-0 outline-none w-full max-w-[400px]">
          <div className="relative overflow-hidden rounded-[3.5rem] shadow-2xl">
            <Dialog.Close className="absolute right-6 top-6 z-[60] rounded-full p-1 text-slate-400 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </Dialog.Close>

            <div className="bg-[#181818]">
              {/* Role Indicator Banner - Show for both modes */}
              <div className="px-6 pt-6 pb-4 text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-300 border border-blue-500/30">
                  <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                  {mode === "signup" ? "Creating" : "Accessing"}{" "}
                  {defaultRole === "resident" ? "Resident" : "Professional"}{" "}
                  Account
                </div>
              </div>

              {mode === "login" ? (
                <SignIn
                  appearance={commonAppearance}
                  redirectUrl="/"
                  signUpUrl="#"
                />
              ) : (
                <SignUp
                  appearance={commonAppearance}
                  afterSignUpUrl="/"
                  signInUrl="#"
                  unsafeMetadata={{
                    role: defaultRole,
                  }}
                />
              )}

              <div className="text-center pt-4 pb-4 text-sm text-slate-500">
                {mode === "login" ? (
                  <p>
                    No account?{" "}
                    <button
                      onClick={() => setMode("signup")}
                      className="text-blue-400 font-bold hover:underline"
                    >
                      Sign up
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{" "}
                    <button
                      onClick={() => setMode("login")}
                      className="text-blue-400 font-bold hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
