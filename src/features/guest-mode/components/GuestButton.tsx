"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/authClient";

interface GuestButtonProps {
  onGuestSignIn?: () => void;
}

const GuestButton = ({ onGuestSignIn }: GuestButtonProps) => {
  const router = useRouter();

  const handleGuestSignIn = async () => {
    try {
      const { error } = await authClient.signIn.anonymous();
      if (error) {
        console.error("Failed to sign in as guest:", error);
        toast.error("Failed to sign in as guest");
        return;
      }
      onGuestSignIn?.();
      router.push("/feed");
    } catch (err) {
      console.error("Guest sign-in failed:", err);
      toast.error("Failed to sign in as guest");
    }
  };

  return (
    <Button onClick={handleGuestSignIn} variant="outline">
      Continue as Guest
    </Button>
  );
};

export { GuestButton };
