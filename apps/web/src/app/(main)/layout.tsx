import MainLayoutContainer from "@/features/main-layout/containers/MainLayoutContainer";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <MainLayoutContainer>{children}</MainLayoutContainer>;
}
