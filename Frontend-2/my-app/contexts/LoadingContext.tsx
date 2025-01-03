import React, { createContext, useState, ReactNode } from "react";

// Define the types for the context value
interface LoadingContextType {
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

// Create the context with default values
export const LoadingContext = createContext<LoadingContextType>({
  loading: false,
  startLoading: () => {},
  stopLoading: () => {},
});

// The provider component
export const LoadingContextProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(true);

  // Functions to start and stop loading
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  // Provide the state and functions via context
  return (
    <LoadingContext.Provider value={{ loading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
