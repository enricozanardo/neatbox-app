import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

import Authentication from 'Authentication';
import Layout from 'components/layout';
import ScrollToTop from 'components/layout/ScrollToTop';
import Toast from 'components/layout/Toast';
import SEO from 'components/ui/SEO';

import AccountDataFetcher from './AccountDataFetcher';
import ClientStatusFetcher from './ClientStatusFetcher';
import Routes from './Routes';

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <Authentication>
        <HelmetProvider>
          <SEO rootMetadata />
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools />
            <ClientStatusFetcher />
            <AccountDataFetcher />
            <Toast />
            <ScrollToTop />
            <Layout>
              <Routes />
            </Layout>
          </QueryClientProvider>
        </HelmetProvider>
      </Authentication>
    </BrowserRouter>
  );
}

export default App;
