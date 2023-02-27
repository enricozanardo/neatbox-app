import { useAuth0 } from '@auth0/auth0-react';
import Hr from 'components/ui/Hr';
import Icon from 'components/ui/Icon';
import PageTitle from 'components/ui/PageTitle';
import Unauthorized from 'components/ui/Unauthorized';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAccountStore } from 'stores/useAccountStore';
import { useWalletStore } from 'stores/useWalletStore';
import { devLog } from 'utils/helpers';

import AccountStatistics from './AccountStatistics';
import DangerZone from './DangerZone';
import FilesDisplay from './FilesDisplay';
import MyFilesTransfersIndicator from './MyFilesTransfersIndicator';
import UserProfile from './UserProfile';
import Wallet from './Wallet';

const NoWalletFeedback = () => {
  return (
    <div className="text-center text-gray-400 text-sm">
      <Icon type="faBug" /> Create or import a wallet to view this data
    </div>
  );
};

const Dashboard = () => {
  const account = useAccountStore(state => state.account);
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
        <UserProfile user={user} />

        <Wallet />

        <div className="col-span-1 lg:col-span-2">
          <Hr />
        </div>

        <div className="col-span-1 lg:col-span-2">
          <PageTitle text="Account Information" />
          {account && <AccountStatistics account={account} />}
          {!wallet && <NoWalletFeedback />}
        </div>

        <div className="col-span-1 lg:col-span-2">
          <Hr />
        </div>

        <div className="col-span-1 lg:col-span-2" id="myFiles" ref={myFilesRef}>
          <PageTitle text="My Files" />
          {account && <FilesDisplay fileIds={account.storage.filesOwned} />}
          <MyFilesTransfersIndicator fileId={ref} />

          {!wallet && <NoWalletFeedback />}
        </div>

        <div className="col-span-1 lg:col-span-2">
          <Hr />
        </div>

        <div className="col-span-1 lg:col-span-2">
          <PageTitle text="Files Shared With Me" />
          {account && <FilesDisplay fileIds={account.storage.filesAllowed} />}

          {!wallet && <NoWalletFeedback />}
        </div>

        {wallet && (
          <>
            <div className="col-span-1 lg:col-span-2">
              <Hr />
            </div>
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
