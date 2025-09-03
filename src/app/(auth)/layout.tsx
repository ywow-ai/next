import { FC } from "react";

const AuthLayout: FC<
  Readonly<{
    children: React.ReactNode;
  }>
> = ({ children }) => {
  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-screen">
      <div className="max-w-lg w-full">{children}</div>
    </div>
  );
};

export default AuthLayout;
