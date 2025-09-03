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
        setUser(session.data?.user ?? null);
      } catch (error) {
        setUser(null);
      }
    })();
  }, []);

  const signOut = async () => {
    try {
      await authClient.signOut();
      router.push("/sign-in");
    } catch (error) {
      console.log(error);
    }
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
