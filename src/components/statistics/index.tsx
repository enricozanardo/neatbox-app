import { useEffect, useState } from 'react';
import { invokeAction } from 'services/api';
import { ApiAction, StatisticStoreData } from 'types';

import StatCard from './StatCard';

const Statistics = () => {
  const [stats, setStats] = useState<StatisticStoreData>({ accounts: 0, files: 0, transfers: 0, collections: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const data = await invokeAction<StatisticStoreData>(ApiAction.GetStorageStatistics);
      setStats(data);
    };

    fetchData();
  }, []);

  const { accounts, files, transfers, collections } = stats;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4  mt-20 mb-16">
      <StatCard label="Users" value={accounts} />
      <StatCard label="Files" value={files} />
      <StatCard label="Collections" value={collections} />
      <StatCard label="Transfers" value={transfers} />
    </div>
  );
};

export default Statistics;
