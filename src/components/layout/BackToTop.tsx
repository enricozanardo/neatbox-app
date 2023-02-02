import { useEffect, useState } from 'react';
import { getClasses } from 'utils/helpers';

import Icon from '../ui/Icon';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6">
      <button
        type="button"
        onClick={scrollToTop}
        className={getClasses(
          isVisible ? 'opacity-100' : 'opacity-0',
          'text-white inline-flex items-center p-3 rounded-full shadow-md transition-opacity bg-primary-300 hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400',
        )}
        aria-label="Back To Top"
      >
        <Icon type="faArrowUp" className="h-6 w-6 text-white" aria-hidden="true" />
      </button>
    </div>
  );
};

export default BackToTop;
