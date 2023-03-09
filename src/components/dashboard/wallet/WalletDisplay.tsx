import Clipboard from 'components/ui/Clipboard';
import { Wallet } from 'types';
import { getClasses } from 'utils/helpers';

const Card = ({ label, text, blur }: { label: string; text: string; blur?: boolean }) => {
  return (
    <div className="flex justify-center">
      <div className="w-full py-8 px-4 text-center border-2 border-primary-400 bg-white shadow-lg rounded-xl">
        <span className="block label">{label}</span>
        <span className={getClasses(blur ? 'blur-sm hover:blur-none' : '', 'text-xs')}>{text}</span>
        <span className="text-gray-400 ml-2">
          <Clipboard value={text} />
        </span>
      </div>
    </div>
  );
};

type Props = { wallet: Wallet };

const WalletDisplay = ({ wallet }: Props) => {
  return (
    <div className="space-y-10">
      <Card label="Address" text={wallet.binaryAddress} />
      <Card label="Passphrase" text={wallet.passphrase} blur />
    </div>
  );
};

export default WalletDisplay;
