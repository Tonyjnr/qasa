/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/auth/AccountDialog.tsx - FIXED VERSION
// Key changes:
// 1. Remove userId parameter from authApi calls
// 2. Server reads userId from JWT token automatically
// 3. Fixed getSessions() call - it doesn't take userId parameter

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import * as Avatar from "@radix-ui/react-avatar";
import {
  X,
  User,
  Shield,
  Monitor,
  Trash2,
  Camera,
  Mail,
  Plus,
} from "lucide-react";
import { getCurrentUser, removeAuthToken } from "../../lib/auth";
import { authApi } from "../../services/authApi";
import { cn } from "../../lib/utils";
import { toast } from "sonner";

interface AccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UserData {
  email: string | undefined;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  connectedAccounts: { provider: string; username: string }[];
}

interface Session {
  id: string;
  deviceName: string;
  os: string;
  location: string;
  ip: string;
  isCurrent: boolean;
  lastActive: string;
}

export function AccountDialog({ open, onOpenChange }: AccountDialogProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadUserData();
      loadSessions();
    }
  }, [open]);

  const loadUserData = async () => {
    try {
      // Fetch fresh details from server
      const freshUser = await authApi.getCurrentUser();
      if (freshUser) {
        setUserData({
          email: freshUser.email,
          firstName: freshUser.firstName || "",
          lastName: freshUser.lastName || "",
          avatarUrl: freshUser.avatarUrl || null,
          connectedAccounts: [], // Mock for now
        });
      }
    } catch (e) {
      console.error("Failed to fetch fresh user data", e);
      // Fallback to token data
      const user = getCurrentUser();
      if (user) {
        setUserData({
          email: user.email,
          firstName: "User",
          lastName: "",
          avatarUrl: null,
          connectedAccounts: [],
        });
      }
    }
  };

  const loadSessions = async () => {
    try {
      // ✅ FIXED: Server reads userId from JWT token automatically
      const fetchedSessions = await authApi.getSessions();

      setSessions(
        fetchedSessions.map(
          (s: {
            id: string;
            deviceName: string | null;
            ipAddress: string | null;
            lastActive: Date;
          }) => ({
            id: s.id,
            deviceName: s.deviceName || "Unknown Device",
            os: "Unknown OS",
            location: "Unknown Location",
            ip: s.ipAddress || "Unknown",
            isCurrent: false,
            lastActive: new Date(s.lastActive).toLocaleString(),
          })
        )
      );
    } catch (error) {
      console.error("Failed to load sessions", error);
      toast.error("Failed to load sessions");
    }
  };

  const handlePasswordUpdate = async () => {
    const currentPassword = window.prompt("Enter your current password:");
    if (!currentPassword) return;

    const newPassword = window.prompt("Enter your new password (min 8 chars):");
    if (!newPassword) return;

    setIsLoading(true);
    try {
      // ✅ FIXED: Server reads userId from JWT token
      await authApi.updatePassword(currentPassword, newPassword);
      toast.success("Password updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSessionRevoke = async (sessionId: string) => {
    try {
      await authApi.revokeSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      toast.success("Device signed out successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out device");
    }
  };

  const handleAccountDelete = async () => {
    const confirmation = window.prompt(
      "To confirm deletion, type 'DELETE' (case sensitive):"
    );

    if (confirmation !== "DELETE") {
      if (confirmation !== null) toast.error("Incorrect confirmation text");
      return;
    }

    const password = window.prompt("Enter your password to confirm deletion:");
    if (!password) return;

    try {
      // ✅ FIXED: Server reads userId from JWT token
      await authApi.deleteAccount(password);

      toast.success("Account deleted successfully");
      onOpenChange(false);
      removeAuthToken();
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete account");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <div>
              <Dialog.Title className="text-lg font-bold text-slate-900">
                Account
              </Dialog.Title>
              <Dialog.Description className="text-sm text-slate-600">
                Manage your account info.
              </Dialog.Description>
            </div>
            <Dialog.Close className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          {/* Tabs */}
          <Tabs.Root
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex overflow-hidden"
          >
            {/* Sidebar */}
            <Tabs.List className="w-48 border-r border-slate-200 p-4 space-y-1">
              <Tabs.Trigger
                value="profile"
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors outline-none",
                  activeTab === "profile"
                    ? "bg-slate-100 text-slate-900 font-medium"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Tabs.Trigger>

              <Tabs.Trigger
                value="security"
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors outline-none",
                  activeTab === "security"
                    ? "bg-slate-100 text-slate-900 font-medium"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Shield className="h-4 w-4" />
                <span>Security</span>
              </Tabs.Trigger>
            </Tabs.List>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
              {/* Profile Tab */}
              <Tabs.Content value="profile" className="p-6 outline-none">
                <div className="space-y-6">
                  {/* Avatar Section */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-4">
                      Profile
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar.Root className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
                          <Avatar.Fallback className="text-2xl font-bold text-white">
                            {userData?.email?.slice(0, 2).toUpperCase()}
                          </Avatar.Fallback>
                        </Avatar.Root>
                        <button className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                          <Camera className="h-3 w-3 text-slate-600" />
                        </button>
                      </div>
                      <div>
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                          Update profile
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Email Addresses */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">
                      Email addresses
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {userData?.email}
                            </p>
                            <p className="text-xs text-slate-500">Primary</p>
                          </div>
                        </div>
                        <button className="text-xs text-slate-400 hover:text-slate-600">
                          •••
                        </button>
                      </div>
                      <button className="w-full flex items-center gap-2 p-3 rounded-lg border border-dashed border-slate-300 text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-colors">
                        <Plus className="h-4 w-4" />
                        <span>Add email address</span>
                      </button>
                    </div>
                  </div>

                  {/* Connected Accounts */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">
                      Connected accounts
                    </h3>
                    <div className="space-y-2">
                      {userData?.connectedAccounts?.map((account, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg border border-slate-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center">
                              <span className="text-xs text-white font-bold">
                                {account.provider[0]}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900">
                                {account.provider}
                              </p>
                              <p className="text-xs text-slate-500">
                                {account.username}
                              </p>
                            </div>
                          </div>
                          <button className="text-xs text-slate-400 hover:text-slate-600">
                            •••
                          </button>
                        </div>
                      ))}
                      <button className="w-full flex items-center gap-2 p-3 rounded-lg border border-dashed border-slate-300 text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-colors">
                        <Plus className="h-4 w-4" />
                        <span>Connect account</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Tabs.Content>

              {/* Security Tab */}
              <Tabs.Content value="security" className="p-6 outline-none">
                <div className="space-y-6">
                  {/* Password Section */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">
                      Password
                    </h3>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          Set password
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Update your account password
                        </p>
                      </div>
                      <button
                        onClick={handlePasswordUpdate}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  {/* Active Devices */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">
                      Active devices
                    </h3>
                    <div className="space-y-2">
                      {sessions.map((session) => (
                        <div
                          key={session.id}
                          className="flex items-start justify-between p-4 rounded-lg border border-slate-200"
                        >
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                              <Monitor className="h-5 w-5 text-slate-600" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-slate-900">
                                  {session.deviceName} {session.os}
                                </p>
                                {session.isCurrent && (
                                  <span className="px-2 py-0.5 text-[10px] font-medium bg-green-100 text-green-700 rounded-full">
                                    This device
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {session.ip} ({session.location})
                              </p>
                              <p className="text-xs text-slate-400 mt-1">
                                {session.lastActive}
                              </p>
                            </div>
                          </div>
                          {!session.isCurrent && (
                            <button
                              onClick={() => handleSessionRevoke(session.id)}
                              className="text-xs text-slate-400 hover:text-red-600 transition-colors"
                            >
                              •••
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delete Account */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">
                      Delete account
                    </h3>
                    <div className="p-4 rounded-lg border border-red-200 bg-red-50">
                      <div className="flex items-start gap-3 mb-3">
                        <Trash2 className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-red-900">
                            Permanently delete account
                          </p>
                          <p className="text-xs text-red-700 mt-1">
                            This action cannot be undone. All your data will be
                            permanently removed.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleAccountDelete}
                        className="w-full px-4 py-2 text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 border border-red-300 hover:border-red-600 rounded-lg transition-colors"
                      >
                        Delete account
                      </button>
                    </div>
                  </div>
                </div>
              </Tabs.Content>
            </div>
          </Tabs.Root>

          {/* Footer Badge */}
          <div className="px-6 py-3 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                Secured by QASA
              </span>
              <span className="text-[10px] text-orange-500 font-medium">
                Development mode
              </span>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
