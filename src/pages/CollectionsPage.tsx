import Collections from 'components/collections';
import SEO from 'components/ui/SEO';

const CollectionsPage = () => {
  return (
    <section className="container max-w-4xl">
      <SEO pageTitle="Collections" />
      <Collections />
    </section>
  );
};

export default CollectionsPage;
