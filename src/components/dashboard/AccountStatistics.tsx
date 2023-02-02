import Statistic from 'components/ui/Statistic';
import { AccountProps } from 'types';
import { displayBalance, displayNumber } from 'utils/formatting';

type Props = {
  account: AccountProps;
};

const AccountStatistics = ({ account }: Props) => {
  return (
    <>
      <div className="hidden md:flex justify-center gap-16 lg:gap-32">
        <Statistic label="Balance" value={displayBalance(account.token.balance)} />
        <Statistic label="Files Owned" value={displayNumber(account.storage.filesOwned.length)} />

        {/* Using a dummy num of transactions value for the time being. Fetching the number of transactions is not easily achieved in v5 of the SDK. */}
        <Statistic label="Transactions" value={displayNumber(64)} />
      </div>

      <div className="md:hidden mx-8">
        <div className="flex justify-between">
          <div>Balance</div>
          <div className="font-bold">{displayBalance(account.token.balance)}</div>
        </div>

        <div className="flex justify-between">
          <div>Files Owned</div>
          <div className="font-bold">{displayNumber(account.storage.filesOwned.length)}</div>
        </div>

        <div className="flex justify-between">
          <div>Transactions</div>
          <div className="font-bold">{displayNumber(64)}</div>
        </div>
      </div>
    </>
  );
};

export default AccountStatistics;
