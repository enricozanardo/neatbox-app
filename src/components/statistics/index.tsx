import { useEffect, useState } from 'react';
import { invokeAction } from 'services/api';
import { ApiAction, StorageStatistics } from 'types';

import StatCard from './StatCard';

const Statistics = () => {
  const [stats, setStats] = useState<StorageStatistics>({ users: 0, files: 0, transfers: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const data = await invokeAction<StorageStatistics>(ApiAction.GetStorageStatistics);
      setStats(data);
    };

    fetchData();
  }, []);

  const { users, files, transfers } = stats;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 md:gap-4 lg:gap-8 xl:gap-16 mt-20 mb-16">
      <StatCard label="Users" value={users} />
      <StatCard label="Files" value={files} />
      <StatCard label="Transfers" value={transfers} />
    </div>
  );
};

export default Statistics;
