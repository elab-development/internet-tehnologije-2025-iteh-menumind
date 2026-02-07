import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { AuthType } from "./auth-type";

export const { signIn, signOut, signUp, getSession } = createAuthClient({
  plugins: [inferAdditionalFields<AuthType>()],
});
