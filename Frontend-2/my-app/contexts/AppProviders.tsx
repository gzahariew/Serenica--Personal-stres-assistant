import React from "react";
import { ErrContextProvider } from "./ErrContext";
import { LoadingContextProvider } from "./LoadingContext";

export const AppProviders = ({ children }: any) => {
  return (
    <ErrContextProvider>
      <LoadingContextProvider>{children}</LoadingContextProvider>
    </ErrContextProvider>
  );
};
