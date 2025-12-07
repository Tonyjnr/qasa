import { UserProfile } from "@clerk/clerk-react";

export const ProfileView = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50 p-4">
      <UserProfile path="/profile" routing="path" />
    </div>
  );
};
