import SignIn from "@/components/app/auth/sign-in";
import Link from "next/link";
import { type ReactNode } from "react";

export default async (): Promise<ReactNode> => {
  return (
    <div className="flex flex-col gap-4 items-center">
      <SignIn />
      <Link href="/sign-up">SignUp</Link>
    </div>
  );
};
