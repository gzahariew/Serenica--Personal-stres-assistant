import React, { createContext, useState, ReactNode } from "react";

interface ErrorContextType {
  error: string | null;
  setError: (error: string | null) => void;
}

export const ErrContext = createContext<ErrorContextType>({
  error: null,
  setError: () => {},
});

export const ErrContextProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<string | null>(null);

  return (
    <ErrContext.Provider value={{ error, setError }}>
      {children}
    </ErrContext.Provider>
  );
};
