import type { Metadata } from "next";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default async (): Promise<ReactNode> => {
  return (
    <Fragment>
      <h1>404 - Page Not Found</h1>
      <p>This page does not exist.</p>
      <Link href="/">go home</Link>
    </Fragment>
  );
};
