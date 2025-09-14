import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { username } from "better-auth/plugins";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET as string,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async (data, request) => {
      console.log(data, request);
    },
  },
  plugins: [username()],
  user: {
    additionalFields: {
      isVerified: { type: "boolean", required: true, defaultValue: true },
      phone: { type: "string", required: false },
    },
  },
});
