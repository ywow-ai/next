import { ReactNode } from "react";

type Props = Readonly<{
  children: ReactNode;
}>;

export default async ({ children }: Props): Promise<ReactNode> => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-lg w-full">{children}</div>
    </div>
  );
};
