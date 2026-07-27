"use client";
import { useEffect } from "react";
import { queryClient } from "@/shared/lib/api/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "next-themes";
import FeatureLockModal from "@/shared/components/customs/FeatureLockModal";
import DynamicSeoHead from "@/shared/components/customs/DynamicSeoHead";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";
import { useFeatureLockLogic } from "@/shared/lib/hooks/useFeatureLockLogic.hook";

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: Readonly<ProvidersProps>) {
  const lockLogic = useFeatureLockLogic();

  useEffect(() => {
    // Force write to localStorage on very first visit so it exists
    if (!localStorage.getItem("findmytang-guest-storage")) {
      useGuestStore.setState({ isGuest: true });
    }

    const runDexieTasks = () => {
      useGuestStore.getState().seedDefaultGuestData().catch(console.error);
      useGuestStore.getState().runAutoDeleteTasks().catch(console.error);
    };

    if (typeof requestIdleCallback !== "undefined") {
      requestIdleCallback(runDexieTasks, { timeout: 3000 });
    } else {
      setTimeout(runDexieTasks, 200);
    }
  }, []);

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
      {lockLogic.isReady && (
        <FeatureLockModal
          isOpen={lockLogic.isOpen}
          featureName={lockLogic.featureName}
          onClose={lockLogic.onClose}
          onSignUp={lockLogic.onSignUp}
        />
      )}
      <ReactQueryDevtools buttonPosition="bottom-right" />
    </QueryClientProvider>
  );
}
