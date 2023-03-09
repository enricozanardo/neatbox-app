import Button from 'components/ui/Button';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Wallet } from 'types';

export const PassphraseValidator = ({ onSuccess, wallet }: { onSuccess: () => void; wallet: Wallet | null }) => {
  const [passphrase, setPassphrase] = useState('');

  const onSubmit = () => {
    if (passphrase !== wallet?.passphrase) {
      toast.error('Invalid passphrase');
      return;
    }

    onSuccess();
    toast.success('Settings revealed');
  };

  return (
    <div className="text-center">
      <input
        type="text"
        className="base-input mb-4"
        value={passphrase}
        onChange={e => setPassphrase(e.target.value)}
        placeholder="Enter passphrase to reveal settings.."
      />

      <Button onClick={onSubmit} color="primary-bordered">
        Validate
      </Button>
    </div>
  );
};
