import { client } from "@/lib/client";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

type Params = Promise<{ username: string }>;
type Props = Readonly<{
  params: Params;
}>;

export default async ({ params }: Props): Promise<ReactNode> => {
  const { username } = await params;
  const user = await client.api.users({ identifier: username }).get();
  if (user.status === 404) notFound();

  return <p>username: {username}</p>;
};
