'use client';
import { SerwistProvider } from "@serwist/turbopack/react";

export { SerwistProvider } from "@serwist/turbopack/react";

export function PWAProvider({ children }: { children: React.ReactNode }) {
  return (
    <SerwistProvider swUrl="/serwist/sw.js"> 
      {children}
    </SerwistProvider>
  );
}