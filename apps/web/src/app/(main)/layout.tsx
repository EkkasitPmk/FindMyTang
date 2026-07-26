import { Suspense } from "react";
import MainLayoutContainer from "@/features/main-layout/containers/MainLayoutContainer";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MainLayoutContainer>{children}</MainLayoutContainer>
    </Suspense>
  );
}
