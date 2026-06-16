import React from "react";
import NavContainer from "@/features/nav/containers/NavContainer";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <NavContainer>{children}</NavContainer>;
}
