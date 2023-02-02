import { useEffect, useState } from 'react';
import { invokeAction } from 'services/api';
import { ApiAction, StorageStatistics } from 'types';

import StatCard from './StatCard';

const Statistics = () => {
  const [stats, setStats] = useState<StorageStatistics>({ files: 0, transfers: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const data = await invokeAction<StorageStatistics>(ApiAction.GetStorageStatistics);
      setStats(data);
    };

    fetchData();
  }, []);

  const { files, transfers } = stats;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 md:gap-4 lg:gap-8 xl:gap-16 mt-20 mb-16">
      {/* Using a dummy active users value for the time being. Fetching the number of users is not easily achieved in v5 of the SDK. */}
      <StatCard label="Users" value={12} />
      <StatCard label="Files" value={files} />
      <StatCard label="Transfers" value={transfers} />
    </div>
  );
};

export default Statistics;
