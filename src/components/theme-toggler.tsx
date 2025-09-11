"use client";
import { DarkThemeToggle } from "flowbite-react";
import type { FC } from "react";

const ThemeToggler: FC = () => {
  return (
    <div className="fixed bottom-4 right-4 bg-gray-300 dark:bg-gray-800 p-2 rounded-full">
      <DarkThemeToggle className="rounded-full cursor-pointer transition-colors duration-200" />
    </div>
  );
};

export default ThemeToggler;
