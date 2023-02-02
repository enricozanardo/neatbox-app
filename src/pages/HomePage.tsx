import Home from 'components/home';
import SEO from 'components/ui/SEO';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';

const HomePage = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('logout') === 'true') {
      toast.success('Successfully logged out!');
    }
  }, [searchParams]);

  return (
    <section className="container max-w-4xl">
      <SEO />

      <Home />
    </section>
  );
};

export default HomePage;
