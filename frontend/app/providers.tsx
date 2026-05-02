"use client";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
      <Toaster position="bottom-right" toastOptions={{
        style: { background: "#0f172a", color: "#fff", border: "1px solid #10b981" },
      }} />
    </ThemeProvider>
  );
}