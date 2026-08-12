import MainLayoutContainer from "@/features/main-layout/containers/MainLayoutContainer";

export const dynamic = "force-dynamic";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <MainLayoutContainer>{children}</MainLayoutContainer>;
}
