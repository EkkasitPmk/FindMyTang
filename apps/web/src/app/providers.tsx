"use client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

type ProvidersProps = {
  children: React.ReactNode;
};
export default function Providers({ children }: Readonly<ProvidersProps>) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ToastContainer position="top-center" autoClose={2000} />
      <ReactQueryDevtools buttonPosition="bottom-right" />
    </QueryClientProvider>
  );
}
