import { useAuth0 } from '@auth0/auth0-react';
import useAccountData from 'hooks/useAccountData';
import BrowsePage from 'pages/BrowsePage';
import ForbiddenPage from 'pages/ForbiddenPage';
import LandingPage from 'pages/LandingPage';
import LoadingPage from 'pages/LoadingPage';
import ServiceUnavailable from 'pages/ServiceUnavailablePage';
import ViewPage from 'pages/ViewPage';
import WelcomePage from 'pages/WelcomePage';
import { lazy, Suspense } from 'react';
import { Outlet, Route, Routes as BrowserRoutes } from 'react-router-dom';
import { useClientStatusStore } from 'stores/useClientStatusStore';

const CollectionsPage = lazy(() => import('pages/CollectionsPage'));
const DashboardPage = lazy(() => import('pages/DashboardPage'));
const HomePage = lazy(() => import('pages/HomePage'));
const UnauthorizedPage = lazy(() => import('pages/UnauthorizedPage'));
const NotFoundPage = lazy(() => import('pages/NotFoundPage'));
const RequestsPage = lazy(() => import('pages/RequestsPage'));
const TransferCollectionPage = lazy(() => import('pages/TransferCollectionPage'));
const TransferFilePage = lazy(() => import('pages/TransferFilePage'));
const TransferPage = lazy(() => import('pages/TransferPage'));
const UploadPage = lazy(() => import('pages/UploadPage'));
const RegisterPage = lazy(() => import('pages/RegisterPage'));

const AuthenticatedRoute = ({ isAllowed, children }: { isAllowed: boolean; children?: any }) => {
  if (!isAllowed) {
    return <UnauthorizedPage />;
  }

  return children ?? <Outlet />;
};

const RegisteredUserRoute = ({
  isAllowed,
  clientIsOnline,
  children,
}: {
  isAllowed: boolean;
  clientIsOnline: boolean | null;
  children?: any;
}) => {
  if (!isAllowed && clientIsOnline === null) {
    return <LoadingPage />;
  }

  if (!isAllowed && clientIsOnline === false) {
    return <ServiceUnavailable />;
  }

  if (!isAllowed) {
    return <ForbiddenPage />;
  }

  return children ?? <Outlet />;
};

const Routes = () => {
  const { isAuthenticated } = useAuth0();
  const { account } = useAccountData();
  const accountExists = !!account?.storage.map.emailHash;
  const { clientIsOnline } = useClientStatusStore();

  return (
    <Suspense fallback={null}>
      <BrowserRoutes>
        <Route path="/" element={<HomePage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/view/:id" element={<ViewPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="*" element={<NotFoundPage />} />

        <Route element={<AuthenticatedRoute isAllowed={isAuthenticated} />}>
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route element={<RegisteredUserRoute clientIsOnline={clientIsOnline} isAllowed={accountExists} />}>
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/transfer" element={<TransferPage />} />
            <Route path="/transfer/file" element={<TransferFilePage />} />
            <Route path="/transfer/collection" element={<TransferCollectionPage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/requests" element={<RequestsPage />} />
          </Route>
        </Route>
      </BrowserRoutes>
    </Suspense>
  );
};

export default Routes;
