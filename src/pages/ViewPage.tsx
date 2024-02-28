import { useParams } from 'react-router-dom';

import View from 'components/view';
import NotFoundPage from 'pages/NotFoundPage';

const ViewPage = () => {
  const { id } = useParams();

  if (!id) {
    return <NotFoundPage />;
  }

  return (
    <section className="max-w-xl w-full">
      {/* SEO in View component */}
      <View id={id} />
    </section>
  );
};

export default ViewPage;
