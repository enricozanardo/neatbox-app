import ErrorBoundary from 'components/error-boundary/ErrorBoundary';
import { ReactNode } from 'react';

import BackToTop from './BackToTop';
import Bubble from './Bubble';
import Clouds from './Clouds';
import Footer from './Footer';
import Header from './Header';

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <main className="flex justify-center min-h-[calc(100vh-22.2rem)] ">
        <div className="w-full px-4 pt-4 pb-32 md:pt-6 lg:pt-8 flex justify-center relative">
          <ErrorBoundary>{children}</ErrorBoundary>
          <Clouds />
          <Bubble />
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
};

export default Layout;
