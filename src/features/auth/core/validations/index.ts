import { z } from "zod";

import type { TAuthType } from "@/features/auth/core/types";

export const authSchema = ({ authType }: { authType: TAuthType }) => {
  return z.object({
    fullName:
      authType === "sign-in"
        ? z.string().optional()
        : z.string().min(2).max(50),
    email: z.string().email(),
  });
};
