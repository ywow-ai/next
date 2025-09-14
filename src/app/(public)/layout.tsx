import Nav from "@/components/layouts/nav";
import { Fragment, type ReactNode } from "react";

type Props = Readonly<{
  children: ReactNode;
}>;

export default async ({ children }: Props): Promise<ReactNode> => {
  return (
    <Fragment>
      <Nav />
      {children}
    </Fragment>
  );
};
