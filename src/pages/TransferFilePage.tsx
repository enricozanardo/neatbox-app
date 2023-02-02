import TransferFile from 'components/transfer/TransferFile';
import SEO from 'components/ui/SEO';
import { useSearchParams } from 'react-router-dom';

const TransferFilePage = () => {
  const [searchParams] = useSearchParams();

  return (
    <section className="container max-w-4xl">
      <SEO pageTitle="Transfer File" />
      <TransferFile defaultValue={searchParams.get('defaultValue')} />
    </section>
  );
};

export default TransferFilePage;
