"use client";
import Link from "next/link";
import { FC } from "react";

const Nav: FC = () => {
  return (
    <div>
      <ul>
        <li>
          <Link href="/">home</Link>
        </li>
        <li>
          <Link href="/ticket">ticket</Link>
        </li>
        <li>
          <Link href="/event">event</Link>
        </li>
      </ul>
    </div>
  );
};

export default Nav;
