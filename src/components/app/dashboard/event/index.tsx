"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, Fragment } from "react";

const DashboardEvent: FC = () => {
  const router = useRouter();

  return (
    <Fragment>
      <Link href="/new">Buat Event</Link>
    </Fragment>
  );
};

export default DashboardEvent;
