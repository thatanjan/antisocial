"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/authClient";
import { GuestConfirmationModal } from "./GuestConfirmationModal";

interface GuestButtonProps {
  disabled?: boolean;
}

const GuestButton = ({ disabled }: GuestButtonProps) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGuestSignIn = async () => {
    try {
      setIsLoading(true);
      const { error: signInError } = await authClient.signIn.anonymous();
      if (signInError) {
        console.error("Failed to sign in as guest:", signInError);
        toast.error("Failed to sign in as guest");
        return;
      }
      setShowModal(false);
      router.push("/feed");
    } catch (err) {
      console.error("Guest sign-in failed:", err);
      toast.error("Failed to sign in as guest");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        disabled={disabled || isLoading}
        onClick={() => setShowModal(true)}
        variant="outline"
      >
        Continue as Guest
      </Button>

      <GuestConfirmationModal
        onConfirm={handleGuestSignIn}
        onOpenChange={setShowModal}
        open={showModal}
      />
    </>
  );
};

export { GuestButton };
