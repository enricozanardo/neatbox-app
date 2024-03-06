import Statistic from 'components/ui/Statistic';
import { AccountProps } from 'types';
import { displayBalance, displayNumber } from 'utils/formatting';

type Props = {
  account: AccountProps;
};

const AccountInformation = ({ account }: Props) => {
  return (
    <>
      <div className="hidden md:flex justify-center gap-16 ">
        <Statistic label="Balance" value={displayBalance(account.token.balance)} />
        <Statistic label="Files" value={displayNumber(account.filesOwned.length)} />
        <Statistic label="Collections" value={displayNumber(account.collectionsOwned.length)} />
      </div>

      <div className="md:hidden mx-8">
        <div className="flex justify-between">
          <div>Balance</div>
          <div className="font-bold">{displayBalance(account.token.balance)}</div>
        </div>

        <div className="flex justify-between">
          <div>Files Owned</div>
          <div className="font-bold">{displayNumber(account.filesOwned.length)}</div>
        </div>

        <div className="flex justify-between">
          <div>Collections Owned</div>
          <div className="font-bold">{displayNumber(account.collectionsOwned.length)}</div>
        </div>
      </div>
    </>
  );
};

export default AccountInformation;
