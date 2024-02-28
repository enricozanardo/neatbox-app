import { useNavigate } from 'react-router-dom';

import Button from 'components/ui/Button';
import PageTitle from 'components/ui/PageTitle';
import SEO from 'components/ui/SEO';

const TransferPage = () => {
  const navigate = useNavigate();

  return (
    <section className="container max-w-4xl">
      <SEO pageTitle="Transfer" />

      <PageTitle text="Transfer" />

      <div className="flex justify-center">
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <Button size="lg" onClick={() => navigate('/transfer/file')}>
            File
          </Button>

          <Button size="lg" onClick={() => navigate('/transfer/collection')}>
            Collection
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TransferPage;
