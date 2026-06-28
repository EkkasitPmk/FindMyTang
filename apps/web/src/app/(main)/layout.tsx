import MainLayoutContainer from "@/features/main-layout/containers/MainLayoutContainer";
import { Suspense } from "react";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense>
      <MainLayoutContainer>{children}</MainLayoutContainer>
    </Suspense>
  );
}
