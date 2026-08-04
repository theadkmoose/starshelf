"use client";

   import React from 'react';
   import { QueryClient, QueryClientProvider } from 'react-query';
   import ToastProvider from './components/ToastProvider';

   const queryClient = new QueryClient();

   function App() {
     return (
       <QueryClientProvider client={queryClient}>
         <ToastProvider />
         {/* Your existing code */}
       </QueryClientProvider>
     );
   }

   export default App;