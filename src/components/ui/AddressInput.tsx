import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { fetchAccountMapEntry, fetchUser } from 'services/api';
import { useWalletStore } from 'stores/useWalletStore';
import { AccountProps } from 'types';
import { hashEmail } from 'utils/crypto';
import { isEmail } from 'utils/helpers';

import Label from './Label';

export type RecipientAccount = AccountProps | null | undefined;

type Props = {
  setAddressResult: React.Dispatch<
    React.SetStateAction<{ emailHash: string; rawInput: string; account: AccountProps | null }>
  >;
  disabled?: boolean;
  isTimedTransfer?: boolean;
};

const DEBOUNCE = 500;

export const ADDRESS_RESULT_INIT = {
  emailHash: '',
  rawInput: '',
  account: null as AccountProps | null,
};

const AddressInput = ({ disabled, setAddressResult, isTimedTransfer }: Props) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const wallet = useWalletStore(state => state.wallet);
  const { user } = useAuth0();

  useEffect(() => {
    setError('');
    setSuccess('');

    const validateInputAsEmail = async () => {
      const sanitizedInput = input.toLocaleLowerCase();

      if (user?.email?.toLocaleLowerCase() === sanitizedInput) {
        setError('Can not use own address');
        setAddressResult({ emailHash: '', account: null, rawInput: '' });
        return;
      }

      const emailHash = hashEmail(sanitizedInput);

      const map = await fetchAccountMapEntry(emailHash);

      /** unknown e-mails may proceed in case of timed transfers */
      if (!map && isTimedTransfer) {
        setSuccess('Valid new e-mail');
        setAddressResult({ emailHash, account: null, rawInput: sanitizedInput });
        return;
      }

      if (!map) {
        setError('Recipient not found');
        setAddressResult({ emailHash: '', account: null, rawInput: '' });
        return;
      }

      /** File has been sent here before, but account has not been initialized yet */
      if (!map.binaryAddress) {
        setSuccess('Valid email');
        setAddressResult({ emailHash, account: null, rawInput: sanitizedInput });
        return;
      }

      const account = await fetchUser(map.binaryAddress);

      if (account) {
        setSuccess('Valid address');
        setAddressResult({ emailHash, account, rawInput: sanitizedInput });
        return;
      }

      /** fallback to not found */
      setError('Recipient not found');
      setAddressResult({ emailHash: '', account: null, rawInput: '' });
    };

    const validateInputAsBinaryAddress = async () => {
      if (wallet?.binaryAddress === input) {
        setError('Can not use own address');
        setAddressResult({ emailHash: '', account: null, rawInput: '' });
        return;
      }

      try {
        const account = await fetchUser(input);

        if (!account.storage.map) {
          setError('Recipient account not initialized');
          setAddressResult({ emailHash: '', account: null, rawInput: '' });
          return;
        }

        setSuccess('Valid address');
        setAddressResult({ emailHash: input, account, rawInput: input });
      } catch (err) {
        setError('Recipient not found');
        setAddressResult({ emailHash: '', account: null, rawInput: '' });
        return;
      }
    };

    const id = setTimeout(() => {
      if (!input) {
        return;
      }

      if (isEmail(input)) {
        validateInputAsEmail();
      } else {
        validateInputAsBinaryAddress();
      }
    }, DEBOUNCE);

    return () => {
      clearTimeout(id);
    };
  }, [input, user?.email, setAddressResult, isTimedTransfer, wallet?.binaryAddress]);

  return (
    <label className="block">
      <Label text="Recipient E-mail or Binary Address" />

      <input
        placeholder="Enter an e-mail or wallet address"
        value={input}
        onChange={e => setInput(e.target.value)}
        type="text"
        className="base-input"
        disabled={disabled}
        required
      />

      {error && <span className="text-xs text-red-400">{error}</span>}
      {success && <span className="text-xs text-green-400">{success}</span>}
    </label>
  );
};

export default AddressInput;
