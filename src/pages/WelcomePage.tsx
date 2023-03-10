import Register from 'components/register';
import SEO from 'components/ui/SEO';

const WelcomePage = () => {
  return (
    <section className="max-w-xl w-full">
      <SEO pageTitle="Welcome 👋" />
      {/* <Welcome /> */}

      <Register />
    </section>
  );
};

export default WelcomePage;
