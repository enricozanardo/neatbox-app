import { useEffect, useState } from 'react';
import { getCollectionById } from 'services/api';
import { Collection } from 'types';

export const useCollectionData = (id: string) => {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCollectionById(id);
      setCollection(data);
      setIsLoading(false);
    };

    try {
      fetchData();
    } catch (err) {
      setIsLoading(false);
    }
  }, [id]);

  return { collection, isLoading };
};
