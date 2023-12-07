import React from 'react';
import { DiscardModalProvider } from '../context/discardModalContext';
import { SuccessModalProvider } from '../context/successModalContext';
import { UserProvider } from '../context/userContext';
import { Toaster } from 'react-hot-toast';

export default function AppProviders({ children }) {
  return (
    <React.StrictMode>
      <SuccessModalProvider>
        <DiscardModalProvider>
          <UserProvider>{children}</UserProvider>
        </DiscardModalProvider>
      </SuccessModalProvider>
      <Toaster />
    </React.StrictMode>
  );
}
