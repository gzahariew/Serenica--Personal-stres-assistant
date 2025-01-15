import React, { createContext, useContext, useState, useEffect } from 'react';
import { authorizeGoogleFit, checkAndEnableGoogleFit } from '@/wearableApis/googleFit';

interface GoogleFitContextType {
  isAuthorized: boolean;
  isLoading: boolean;
  error: string | null;
  authorize: () => Promise<void>;
}

const GoogleFitContext = createContext<GoogleFitContextType>({
  isAuthorized: false,
  isLoading: true,
  error: null,
  authorize: async () => {},
});

export const GoogleFitProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const authorize = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const authorized = await authorizeGoogleFit();
      
      if (authorized) {
        await checkAndEnableGoogleFit(); // Update database
        setIsAuthorized(true);
      } else {
        setError('Google Fit authorization failed');
      }
    } catch (err) {
      setError('Failed to authorize Google Fit');
      console.error('Google Fit authorization error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    authorize();
  }, []);

  return (
    <GoogleFitContext.Provider value={{ isAuthorized, isLoading, error, authorize }}>
      {children}
    </GoogleFitContext.Provider>
  );
};

export const useGoogleFit = () => useContext(GoogleFitContext);