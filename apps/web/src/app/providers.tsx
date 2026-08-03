"use client";
import { useSyncExternalStore } from "react";
import { queryClient } from "@/shared/lib/api/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "next-themes";
import DynamicSeoHead from "@/shared/components/customs/DynamicSeoHead";
import GlobalFeatureLockModal from "@/shared/components/customs/GlobalFeatureLockModal";

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: Readonly<ProvidersProps>) {
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  return (
    <QueryClientProvider client={queryClient}>
      <DynamicSeoHead />
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {isMounted ? children : <div className="min-h-screen bg-background" />}
      </ThemeProvider>
      <ToastContainer position="top-center" autoClose={2000} />
      <GlobalFeatureLockModal />
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools buttonPosition="bottom-left" />
      )}
    </QueryClientProvider>
  );
}
