import Clipboard from 'components/ui/Clipboard';
import { Wallet } from 'types';

const Card = ({ label, text, isPassphrase }: { label: string; text: string; isPassphrase?: boolean }) => {
  return (
    <div className="flex justify-center">
      <div className="w-full py-8 px-4 text-center border-2 border-primary-400 bg-white shadow-lg rounded-xl">
        <span className="block label">
          {label}{' '}
          <span className="text-gray-400 ml-2">
            <Clipboard value={text} />
          </span>
        </span>
        {isPassphrase && (
          <div className="blur-sm hover:blur-none text-xs grid grid-cols-6">
            {text.split(' ').map(word => (
              <div key={word} className="px-4 py-2 text-center">
                {word}
              </div>
            ))}
          </div>
        )}
        {!isPassphrase && <span className={'text-xs'}>{text}</span>}
      </div>
    </div>
  );
};

type Props = { wallet: Wallet };

const WalletDisplay = ({ wallet }: Props) => {
  return (
    <div className="space-y-10">
      <Card label="Address" text={wallet.liskAddress} />
      <Card label="Passphrase" text={wallet.passphrase} isPassphrase />
    </div>
  );
};

export default WalletDisplay;
