import { useAuth0 } from '@auth0/auth0-react';
import BrowsePage from 'pages/BrowsePage';
import CollectionsPage from 'pages/CollectionsPage';
import DashboardPage from 'pages/DashboardPage';
import HomePage from 'pages/HomePage';
import NotAllowedPage from 'pages/NotAllowedPage';
import NotFoundPage from 'pages/NotFoundPage';
import RequestsPage from 'pages/RequestsPage';
import TransferCollectionPage from 'pages/TransferCollectionPage';
import TransferFilePage from 'pages/TransferFilePage';
import TransferPage from 'pages/TransferPage';
import UploadPage from 'pages/UploadPage';
import ViewPage from 'pages/ViewPage';
import WelcomePage from 'pages/WelcomePage';
import { Outlet, Route, Routes as BrowserRoutes } from 'react-router-dom';

const ProtectedRoute = ({ isAllowed, children }: { isAllowed: boolean; children?: any }) => {
  if (!isAllowed) {
    return <NotAllowedPage />;
  }

  return children ?? <Outlet />;
};

const Routes = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <BrowserRoutes>
      <Route path="/" element={<HomePage />} />
      <Route path="/browse" element={<BrowsePage />} />
      <Route path="/view/:id" element={<ViewPage />} />
      <Route path="/welcome" element={<WelcomePage />} />
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
  );
};

export default Routes;
