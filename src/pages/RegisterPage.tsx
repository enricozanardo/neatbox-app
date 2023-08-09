import Register from 'components/register';
import SEO from 'components/ui/SEO';

const RegisterPage = () => {
  return (
    <section className="max-w-xl w-full">
      <SEO pageTitle="Welcome 👋" />
      <Register />
    </section>
  );
};

export default RegisterPage;
