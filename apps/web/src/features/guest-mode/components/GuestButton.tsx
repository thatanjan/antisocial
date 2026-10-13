"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { signInAsGuest } from "../actions/sign-in";
import { GuestConfirmationModal } from "./GuestConfirmationModal";

interface GuestButtonProps {
  disabled?: boolean;
}

const GuestButton = ({ disabled }: GuestButtonProps) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGuestSignIn = async () => {
    setIsLoading(true);
    const result = await signInAsGuest();

    if (!result.success) {
      toast.error(result.error ?? "Failed to sign in as guest");
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
