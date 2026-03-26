"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function ConditionalHeader() {
  const pathname = usePathname();

  // The homepage uses its own HomeHeader (transparent style), so skip the shared header
  if (pathname === "/") return null;

  return <Header />;
}
