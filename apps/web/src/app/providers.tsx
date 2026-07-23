"use client";
import { useEffect } from "react";
import { queryClient } from "@/shared/lib/api/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "next-themes";
import FeatureLockModal from "@/shared/components/customs/FeatureLockModal";
import { useGuestStore } from "@/shared/lib/storages/guest.storage";
import { useFeatureLockLogic } from "@/shared/lib/hooks/useFeatureLockLogic.hook";

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: Readonly<ProvidersProps>) {
  const lockLogic = useFeatureLockLogic();

  useEffect(() => {
    // Force write to localStorage on very first visit so it exists
    if (!localStorage.getItem("pocketnote-guest-storage")) {
      useGuestStore.setState({ isGuest: true });
    }
    // Seed default guest data
    useGuestStore.getState().seedDefaultGuestData().catch(console.error);
    // Run guest auto delete tasks on startup
    useGuestStore.getState().runAutoDeleteTasks().catch(console.error);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
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
