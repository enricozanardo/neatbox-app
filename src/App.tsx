import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Authentication from 'Authentication';
import ScrollToTop from 'components/layout/ScrollToTop';
import Toast from 'components/layout/Toast';
import SEO from 'components/ui/SEO';
import { useAccountAutoRefresh } from 'hooks/useAccountAutoRefresh';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { useWalletStore } from 'stores/useWalletStore';

import Layout from './components/layout';
import Routes from './Routes';

const queryClient = new QueryClient();

function App() {
  const wallet = useWalletStore(state => state.wallet);
  useAccountAutoRefresh(wallet?.binaryAddress);

  return (
    <HelmetProvider>
      <SEO rootMetadata />
      <QueryClientProvider client={queryClient}>
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
