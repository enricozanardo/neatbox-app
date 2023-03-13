import { useAuth0 } from '@auth0/auth0-react';
import BrowsePage from 'pages/BrowsePage';
import ViewPage from 'pages/ViewPage';
import { lazy, Suspense } from 'react';
import { Outlet, Route, Routes as BrowserRoutes } from 'react-router-dom';

const CollectionsPage = lazy(() => import('pages/CollectionsPage'));
const DashboardPage = lazy(() => import('pages/DashboardPage'));
const HomePage = lazy(() => import('pages/HomePage'));
const NotAllowedPage = lazy(() => import('pages/NotAllowedPage'));
const NotFoundPage = lazy(() => import('pages/NotFoundPage'));
const RequestsPage = lazy(() => import('pages/RequestsPage'));
const TransferCollectionPage = lazy(() => import('pages/TransferCollectionPage'));
const TransferFilePage = lazy(() => import('pages/TransferFilePage'));
const TransferPage = lazy(() => import('pages/TransferPage'));
const UploadPage = lazy(() => import('pages/UploadPage'));
const RegisterPage = lazy(() => import('pages/RegisterPage'));

const ProtectedRoute = ({ isAllowed, children }: { isAllowed: boolean; children?: any }) => {
  if (!isAllowed) {
    return <NotAllowedPage />;
  }

  return children ?? <Outlet />;
};

const Routes = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <Suspense fallback={null}>
      <BrowserRoutes>
        <Route path="/" element={<HomePage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/view/:id" element={<ViewPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />

        <Route element={<ProtectedRoute isAllowed={isAuthenticated} />}>
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/transfer" element={<TransferPage />} />
          <Route path="/transfer/file" element={<TransferFilePage />} />
          <Route path="/transfer/collection" element={<TransferCollectionPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </BrowserRoutes>
    </Suspense>
  );
};

export default Routes;
