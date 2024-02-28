import { useSearchParams } from 'react-router-dom';

import TransferCollection from 'components/transfer/TransferCollection';
import SEO from 'components/ui/SEO';

const TransferCollectionPage = () => {
  const [searchParams] = useSearchParams();

  return (
    <section className="container max-w-4xl">
      <SEO pageTitle="Transfer Collection" />
      <TransferCollection defaultValue={searchParams.get('defaultValue')} />
    </section>
  );
};

export default TransferCollectionPage;
