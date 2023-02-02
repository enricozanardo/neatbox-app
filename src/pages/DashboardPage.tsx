import Dashboard from 'components/dashboard';
import SEO from 'components/ui/SEO';

const DashboardPage = () => {
  return (
    <section className="container max-w-4xl">
      <SEO pageTitle="Dashboard" />
      <Dashboard />
    </section>
  );
};

export default DashboardPage;
