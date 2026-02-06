"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full h-screen flex justify-center items-center">
      <Link
        href="/"
        className="absolute flex text-white items-center gap-1 top-8 left-8 text-sm underline"
      >
        <ArrowLeft width={16} height={16} />
        Go back
      </Link>
      {children}
    </section>
  );
}
