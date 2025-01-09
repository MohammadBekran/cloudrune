import { REGEXP_ONLY_DIGITS } from "input-otp";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useVerifyOTPModal } from "@/features/auth/core/hooks";
import {
  useSendEmailOTP,
  useVerifyEmailOTP,
} from "@/features/auth/core/services/api/mutations.api";

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

const VerifyOTPModal = ({ accountId }: { accountId: string }) => {
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { email, close } = useVerifyOTPModal();
  const { mutate: verifyOTP, isPending: isVerifyingOTPPending } =
    useVerifyEmailOTP();
  const { mutate: sendEmailOTP, isPending: isSendingEmailOTPPending } =
    useSendEmailOTP();

  const isDisabled =
    password.length < 6 || isVerifyingOTPPending || isSendingEmailOTPPending;
  const isPending = isVerifyingOTPPending || isSendingEmailOTPPending;

  const handleSubmit = async () => {
    verifyOTP(
      {
        json: {
          accountId,
          password,
        },
      },
      {
        onSuccess: () => router.push("/"),
      }
    );
  };

  const handleResendOTP = async () => {
    if (email) {
      sendEmailOTP({
        json: { email },
      });
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
          pattern={REGEXP_ONLY_DIGITS}
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
          {isPending && (
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
              disabled={isPending}
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
