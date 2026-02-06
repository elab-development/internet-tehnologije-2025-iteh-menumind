import { createAuthClient } from "better-auth/client";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { AuthType } from "./auth-type";

export const { signIn, signOut, signUp, getSession } = createAuthClient({
  plugins: [inferAdditionalFields<AuthType>()],
});
