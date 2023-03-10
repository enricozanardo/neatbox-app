import { useAuth0 } from '@auth0/auth0-react';
import PageTitle from 'components/ui/PageTitle';
import Unauthorized from 'components/ui/Unauthorized';
import useAccountData from 'hooks/useAccountData';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useWalletStore } from 'stores/useWalletStore';
import { devLog } from 'utils/helpers';

import AccountInformation from './account-information/AccountInformation';
import DangerZone from './danger-zone/DangerZone';
import FilesDisplay from './files/FilesDisplay';
import MyFilesTransfersIndicator from './files/MyFilesTransfersIndicator';
import DashboardDivider from './shared/DashboardDivider';
import { NoWalletFeedback } from './shared/NoWalletFeedback';
import UserProfile from './wallet/UserProfile';
import Wallet from './wallet/Wallet';

const Dashboard = () => {
  const { account } = useAccountData();
  const wallet = useWalletStore(state => state.wallet);
  const { user } = useAuth0();
  const myFilesRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const ref = searchParams.get('ref');

  useEffect(() => {
    if (myFilesRef.current && ref) {
      myFilesRef.current.scrollIntoView();
    }
  }, [ref]);

  devLog(account?.storage);

  if (!user) {
    return <Unauthorized />;
  }

  return (
    <div className="mb-32">
      <PageTitle text="My Dashboard" />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
        <UserProfile user={user} account={account} />

        <Wallet />

        <DashboardDivider />

        <div className="col-span-1 lg:col-span-2">
          <PageTitle text="Account Information" />
          {account && <AccountInformation account={account} />}
          {!wallet && <NoWalletFeedback />}
        </div>

        <DashboardDivider />

        <div className="col-span-1 lg:col-span-2" id="myFiles" ref={myFilesRef}>
          <PageTitle text="My Files" />
          {account && <FilesDisplay fileIds={account.storage.filesOwned} />}
          <MyFilesTransfersIndicator fileId={ref} />
          {!wallet && <NoWalletFeedback />}
        </div>

        <DashboardDivider />

        <div className="col-span-1 lg:col-span-2">
          <PageTitle text="Files Shared With Me" />
          {account && <FilesDisplay fileIds={account.storage.filesAllowed} />}
          {!wallet && <NoWalletFeedback />}
        </div>

        {wallet && (
          <>
            <DashboardDivider />
            <div className="col-span-1 lg:col-span-2">
              <PageTitle text="Additional Settings" />
              <DangerZone />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
