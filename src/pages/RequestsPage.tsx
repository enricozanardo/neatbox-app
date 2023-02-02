import Requests from 'components/requests';
import SEO from 'components/ui/SEO';

const RequestsPage = () => {
  return (
    <section className="container max-w-4xl">
      <SEO pageTitle="Requests" />
      <Requests />
    </section>
  );
};

export default RequestsPage;
