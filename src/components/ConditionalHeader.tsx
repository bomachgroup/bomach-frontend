"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import HomeHeader from "./HomeHeader";

export default function ConditionalHeader() {
  const pathname = usePathname();

  // Homepage gets the transparent HomeHeader
  if (pathname === "/") return <HomeHeader />;

  return <Header />;
}
