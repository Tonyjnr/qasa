import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Avatar from "@radix-ui/react-avatar";
import { Settings, LogOut, Shield } from "lucide-react";
import { AccountDialog } from "./AccountDialog";
import { getCurrentUser, removeAuthToken } from "../../lib/auth";

interface UserButtonProps {
  onLogout: () => void;
}

export function UserButton({ onLogout }: UserButtonProps) {
  const [accountOpen, setAccountOpen] = useState(false);
  const user = getCurrentUser();

  if (!user) return null;

  const handleLogout = () => {
    removeAuthToken();
    onLogout();
  };

  const initials = user.email.split("@")[0].slice(0, 2).toUpperCase();

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="rounded-full outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <Avatar.Root className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
              <Avatar.Fallback className="text-sm font-semibold text-white">
                {initials}
              </Avatar.Fallback>
            </Avatar.Root>
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="z-50 min-w-[280px] rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
            sideOffset={8}
            align="end"
          >
            {/* User Info Header */}
            <div className="px-3 py-3 mb-1">
              <div className="flex items-center gap-3">
                <Avatar.Root className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
                  <Avatar.Fallback className="text-sm font-semibold text-white">
                    {initials}
                  </Avatar.Fallback>
                </Avatar.Root>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-slate-500 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
            </div>

            <DropdownMenu.Separator className="h-px bg-slate-200 my-1" />

            {/* Menu Items */}
            <DropdownMenu.Item
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 rounded-lg cursor-pointer outline-none hover:bg-slate-100 focus:bg-slate-100"
              onSelect={() => setAccountOpen(true)}
            >
              <Settings className="h-4 w-4" />
              <span>Manage account</span>
            </DropdownMenu.Item>

            <DropdownMenu.Separator className="h-px bg-slate-200 my-1" />

            <DropdownMenu.Item
              className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 rounded-lg cursor-pointer outline-none hover:bg-red-50 focus:bg-red-50"
              onSelect={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenu.Item>

            {/* Footer Badge */}
            <div className="mt-2 px-3 py-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Secured by QASA
                </span>
                <Shield className="h-3 w-3 text-slate-400" />
              </div>
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <AccountDialog open={accountOpen} onOpenChange={setAccountOpen} />
    </>
  );
}
