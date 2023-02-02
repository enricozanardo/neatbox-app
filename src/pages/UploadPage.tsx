import SEO from 'components/ui/SEO';
import Upload from 'components/upload';

const UploadPage = () => {
  return (
    <section className="container max-w-4xl">
      <SEO pageTitle="Upload" />
      <Upload />
    </section>
  );
};

export default UploadPage;
