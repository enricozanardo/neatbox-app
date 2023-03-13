import SEO from 'components/ui/SEO';
import Welcome from 'components/welcome';

const WelcomePage = () => {
  return (
    <section className="max-w-xl w-full">
      <SEO pageTitle="Welcome 👋" />
      <Welcome />
    </section>
  );
};

export default WelcomePage;
