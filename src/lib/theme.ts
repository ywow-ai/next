import { createTheme } from "flowbite-react";

export const mainTheme = createTheme({
  button: {
    base: "cursor-pointer dark:cursor-pointer rounded-sm dark:rounded-sm",
  },
  textInput: {
    field: { input: { base: "rounded-sm dark:rounded-sm" } },
  },
});
