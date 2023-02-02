import Browse from 'components/browse';
import PageTitle from 'components/ui/PageTitle';
import SEO from 'components/ui/SEO';

const BrowsePage = () => {
  return (
    <section className="container max-w-4xl">
      <PageTitle text="Browse Files" />
      <Browse />
      <SEO pageTitle="Browse" />
    </section>
  );
};

export default BrowsePage;
