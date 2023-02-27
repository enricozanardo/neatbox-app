import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Authentication from 'Authentication';
import ScrollToTop from 'components/layout/ScrollToTop';
import Toast from 'components/layout/Toast';
import SEO from 'components/ui/SEO';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { fetchUser } from 'services/api';
import { useWalletStore } from 'stores/useWalletStore';
import { Wallet } from 'types';
import { devLog, generateDefaultAccount } from 'utils/helpers';

import Layout from './components/layout';
import Routes from './Routes';

const queryClient = new QueryClient();

const AccountData = ({ wallet }: { wallet: Wallet }) => {
  const { data, status } = useQuery({
    queryKey: ['account'],
    queryFn: () => fetchUser(wallet.binaryAddress).catch(() => generateDefaultAccount(wallet.binaryAddress)),
    refetchInterval: 10000,
    keepPreviousData: true,
    staleTime: 10000,
  });

  devLog(status);
  devLog(data);

  return null;
};

function App() {
  const wallet = useWalletStore(state => state.wallet);

  return (
    <HelmetProvider>
      <SEO rootMetadata />
      <QueryClientProvider client={queryClient}>
        {wallet && <AccountData wallet={wallet} />}
        <ReactQueryDevtools />
        <BrowserRouter>
          <Toast />
          <ScrollToTop />
          <Authentication>
            <Layout>
              <Routes />
            </Layout>
          </Authentication>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
