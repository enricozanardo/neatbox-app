import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

function useMedia(query: any) {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [query, matches]);

  return matches;
}

export default function Toast() {
  const small = useMedia('(max-width: 640px)');

  return <Toaster position={small ? 'bottom-center' : 'bottom-center'} />;
}
