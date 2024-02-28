import SEO from 'components/ui/SEO';

const ServiceUnavailable = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <SEO pageTitle="503" pageDescription="503 - Service Unavailable" />

      <div className="text-center space-y-4">
        <h1>503 - Service Unavailable</h1>
        <p className="mb-4">Something went wrong. Please try again later.</p>
      </div>
    </div>
  );
};

export default ServiceUnavailable;
