"use client";
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
  return (
    <QueryClientProvider client={queryClient}>
      <DynamicSeoHead />
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
      <ToastContainer position="top-center" autoClose={2000} />
      <GlobalFeatureLockModal />
      <ReactQueryDevtools buttonPosition="bottom-right" />
    </QueryClientProvider>
  );
}
