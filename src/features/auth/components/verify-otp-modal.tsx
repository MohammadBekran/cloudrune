import Image from "next/image";
import { redirect } from "next/navigation";
import { useState } from "react";

import { sendEmailOTP, verifyOTP } from "@/features/auth/core/actions";
import { useVerifyOTPModal } from "@/features/auth/core/hooks";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/lib/utils";

const VerifyOTPModal = ({ accountId }: { accountId: string }) => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { email, close } = useVerifyOTPModal();

  const isDisabled = password.length < 6 || isLoading;

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const session = await verifyOTP({
        accountId,
        password,
      });

      if (!!session.sessionId) {
        toast.success("OTP has been verified");

        setTimeout(() => redirect("/"), 2000);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);

      toast.error("Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (email) {
      setIsLoading(true);
      try {
        await sendEmailOTP({
          email,
        });

        toast.success("OTP has been sent");
      } catch {
        setIsLoading(false);

        toast.error("Failed to resend OTP");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <AlertDialog open={!!email} onOpenChange={close}>
      <AlertDialogContent className="!rounded-[30px]">
        <AlertDialogHeader>
          <div className="flex justify-end">
            <Image
              src="/icons/close-dark.svg"
              alt="Close"
              width={20}
              height={20}
              className="cursor-pointer"
              onClick={close}
            />
          </div>
          <AlertDialogTitle className="text-center h2">
            Enter your OTP
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center subtitle-2">
            We&apos;ve sent a code to{" "}
            <span className="text-brand">{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <InputOTP
          maxLength={6}
          className="shad-otp"
          value={password}
          onChange={setPassword}
        >
          <InputOTPSlot index={0} className="shad-otp-slot" />
          <InputOTPSlot index={1} className="shad-otp-slot" />
          <InputOTPSlot index={2} className="shad-otp-slot" />
          <InputOTPSlot index={3} className="shad-otp-slot" />
          <InputOTPSlot index={4} className="shad-otp-slot" />
          <InputOTPSlot index={5} className="shad-otp-slot" />
        </InputOTP>
        <Button
          type="submit"
          disabled={isDisabled}
          className="submit-button"
          onClick={handleSubmit}
        >
          Submit
          {isLoading && (
            <Image
              src="/icons/loader.svg"
              alt="Loader"
              width={24}
              height={24}
              className="animate-spin"
            />
          )}
        </Button>
        <AlertDialogFooter className="flex !justify-center">
          <div className="subtitle-2 text-light-100">
            Did&apos;t get a code?{" "}
            <Button
              variant="link"
              disabled={isLoading}
              className="pl-0 font-medium text-brand"
              onClick={handleResendOTP}
            >
              Click to resend
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default VerifyOTPModal;
