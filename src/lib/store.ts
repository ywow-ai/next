import { create } from "zustand";
import { authClient } from "./auth-client";

type User = (typeof authClient.$Infer.Session)["user"];

type UserState = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const useGlobalStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
