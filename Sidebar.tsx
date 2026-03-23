import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import React, { useState } from 'react';
import { trpc } from './_core/trpc';
import { Switch, Route } from 'wouter';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Landing from './pages/Landing';
import AdminPanel from './pages/AdminPanel';
import Exchange from './pages/Exchange';
import Shop from './pages/Shop';
import Wallet from './pages/Wallet';
import Settings from './pages/Settings';
import Trade from './pages/Trade';
import News from './pages/News';
import Prices from './pages/Prices';
import Referral from './pages/Referral';

import { ThemeProvider } from './_core/ThemeContext';

export default function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <div className="min-h-screen text-white selection:bg-[#FFD700]/30">
            <Switch>
              <Route path="/" component={Landing} />
              <Route path="/auth" component={Auth} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/admin" component={AdminPanel} />
              <Route path="/exchange" component={Exchange} />
              <Route path="/shop" component={Shop} />
              <Route path="/trade" component={Trade} />
              <Route path="/news" component={News} />
              <Route path="/prices" component={Prices} />
              <Route path="/referral" component={Referral} />
              <Route path="/wallet" component={Wallet} />
              <Route path="/settings" component={Settings} />
              <Route>404 - یافت نشد</Route>
            </Switch>
          </div>
        </ThemeProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
