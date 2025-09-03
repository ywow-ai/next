"use client";
import { authClient } from "@/lib/auth-client";
import { Button, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

const SignIn: FC = () => {
  const router = useRouter();

  const [isProcess, setIsProcess] = useState<boolean>(false);
  const [form, setForm] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });

  const handle = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setIsProcess(true);
      e.preventDefault();
      await authClient.signIn.email({
        email: form.email,
        password: form.password,
      });
      router.push("/");
    } catch (error) {
      console.log(error);
      setIsProcess(false);
    }
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={handle}>
      <div className="gap-1">
        <Label htmlFor="email1" disabled={isProcess}>
          Your email
        </Label>
        <TextInput
          id="email1"
          type="email"
          placeholder="name@flowbite.com"
          required={true}
          value={form.email}
          onChange={({ currentTarget: { value } }) => {
            setForm((prev) => ({ ...prev, email: value }));
          }}
          disabled={isProcess}
        />
      </div>
      <div className="gap-1">
        <Label htmlFor="password1" disabled={isProcess}>
          Your password
        </Label>
        <TextInput
          id="password1"
          type="password"
          required={true}
          value={form.password}
          onChange={({ currentTarget: { value } }) => {
            setForm((prev) => ({ ...prev, password: value }));
          }}
          disabled={isProcess}
        />
      </div>
      <div className="flex items-center gap-2"></div>
      <Button type="submit" disabled={isProcess}>
        Submit
      </Button>
    </form>
  );
};

export default SignIn;
