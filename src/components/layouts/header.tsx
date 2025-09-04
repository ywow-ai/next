"use client";
import { authClient } from "@/lib/auth-client";
import { useGlobalStore } from "@/lib/store";
import { Button, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";
import { BsSearch } from "react-icons/bs";

const Header: FC = () => {
  const router = useRouter();
  const { user, setUser } = useGlobalStore();

  useEffect(() => {
    (async () => {
      try {
        const session = await authClient.getSession();
        if (session.data) {
          setUser(session.data.user);
        } else {
          await signOut();
        }
      } catch (error) {
        await signOut();
      }
    })();
  }, []);

  const signOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setUser(null);
          router.push("/sign-in");
        },
      },
    });
  };

  return (
    <header className="border-b border-b-white flex py-2.5">
      <div className="max-w-6xl w-full mx-auto flex items-center gap-5">
        <div>logo</div>
        <TextInput className="flex-1 h-full" icon={BsSearch} />
        {user ? (
          <div className="flex items-center gap-2.5">
            <span>{user.name}</span>
            <span>|</span>
            <button type="button" className="cursor-pointer" onClick={signOut}>
              logout
            </button>
          </div>
        ) : (
          <Button className="h-full">Masuk</Button>
        )}
      </div>
    </header>
  );
};

export default Header;
