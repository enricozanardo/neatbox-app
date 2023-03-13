import { useAuth0 } from '@auth0/auth0-react';
import PageTitle from 'components/ui/PageTitle';
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
  const accountIsRegistered = account?.storage.map.emailHash;

  return (
    <div className="mb-32">
      <PageTitle text="My Dashboard" />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
        <UserProfile user={user!} account={account} />

        <Wallet />

        <DashboardDivider />

        <div className="col-span-1 lg:col-span-2">
          <PageTitle text="Account Information" />
          {accountIsRegistered ? <AccountInformation account={account} /> : <NoWalletFeedback />}
        </div>

        <DashboardDivider />

        <div className="col-span-1 lg:col-span-2" id="myFiles" ref={myFilesRef}>
          <PageTitle text="My Files" />
          {accountIsRegistered ? <FilesDisplay fileIds={account.storage.filesOwned} /> : <NoWalletFeedback />}
          <MyFilesTransfersIndicator fileId={ref} />
        </div>

        <DashboardDivider />

        <div className="col-span-1 lg:col-span-2">
          <PageTitle text="Files Shared With Me" />
          {accountIsRegistered ? <FilesDisplay fileIds={account.storage.filesAllowed} /> : <NoWalletFeedback />}
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
