import SignUp from "@/components/app/auth/sign-up";
import Link from "next/link";
import { type ReactNode } from "react";

export default async (): Promise<ReactNode> => {
  return (
    <div className="flex flex-col gap-4 items-center">
      <SignUp />
      <Link href="/sign-in">SignIn</Link>
    </div>
  );
};
