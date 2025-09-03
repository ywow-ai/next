import Header from "@/components/layouts/header";
import { FC, Fragment } from "react";

const PageLayout: FC<
  Readonly<{
    children: React.ReactNode;
  }>
> = ({ children }) => {
  return (
    <Fragment>
      <Header />
      <main className="max-w-6xl mx-auto">{children}</main>
    </Fragment>
  );
};

export default PageLayout;
