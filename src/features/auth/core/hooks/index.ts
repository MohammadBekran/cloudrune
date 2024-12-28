import { useQueryState, parseAsString } from "nuqs";

export const useVerifyOTPModal = () => {
  const [email, setEmail] = useQueryState("otp-modal", parseAsString);

  const open = ({ email }: { email: string }) => setEmail(email);
  const close = () => setEmail(null);

  return { email, open, close, setEmail };
};
