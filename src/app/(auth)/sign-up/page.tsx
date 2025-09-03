"use client";
import { authClient } from "@/lib/auth-client";
import { Button, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

const SignUp: FC = () => {
  const router = useRouter();

  const [form, setForm] = useState<{
    email: string;
    name: string;
    password: string;
  }>({
    email: "",
    name: "",
    password: "",
  });

  const handle = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      await authClient.signUp.email(form);
      await authClient.signIn.email({
        email: form.email,
        password: form.password,
      });
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={handle}>
      <div className="gap-1">
        <Label htmlFor="name1">Your name</Label>
        <TextInput
          id="name1"
          type="text"
          placeholder="johndoe"
          required={true}
          value={form.name}
          onChange={({ currentTarget: { value } }) => {
            setForm((prev) => ({ ...prev, name: value }));
          }}
        />
      </div>
      <div className="gap-1">
        <Label htmlFor="email1">Your email</Label>
        <TextInput
          id="email1"
          type="email"
          placeholder="name@flowbite.com"
          required={true}
          value={form.email}
          onChange={({ currentTarget: { value } }) => {
            setForm((prev) => ({ ...prev, email: value }));
          }}
        />
      </div>
      <div className="gap-1">
        <Label htmlFor="password1">Your password</Label>
        <TextInput
          id="password1"
          type="password"
          required={true}
          value={form.password}
          onChange={({ currentTarget: { value } }) => {
            setForm((prev) => ({ ...prev, password: value }));
          }}
        />
      </div>
      <div className="flex items-center gap-2"></div>
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default SignUp;
