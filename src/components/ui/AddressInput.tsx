import { useAuth0 } from '@auth0/auth0-react';
import useAccountData from 'hooks/useAccountData';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import { fetchAccountMapEntryByEmailHash, fetchAccountMapEntryByUsername, fetchUser } from 'services/api';
import { useWalletStore } from 'stores/useWalletStore';
import { AccountProps } from 'types';
import { hashEmail } from 'utils/crypto';
import { isEmail } from 'utils/helpers';

import Label from './Label';

type Props = {
  setAddressResult: React.Dispatch<
    React.SetStateAction<{ emailHash: string; rawInput: string; account: AccountProps | null; username: string }>
  >;
  disabled?: boolean;
  isTimedTransfer?: boolean;
};

const DEBOUNCE = 500;

export const ADDRESS_RESULT_INIT = {
  emailHash: '',
  username: '',
  rawInput: '',
  account: null as AccountProps | null,
};

const AddressInput = ({ disabled, setAddressResult, isTimedTransfer }: Props) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { account: userAccount } = useAccountData();
  const wallet = useWalletStore(state => state.wallet);
  const { user } = useAuth0();

  useEffect(() => {
    setError('');
    setSuccess('');

    const validateInputAsEmail = async () => {
      const sanitizedInput = input.toLocaleLowerCase();

      if (user?.email?.toLocaleLowerCase() === sanitizedInput) {
        setError('Can not use own address');
        setAddressResult({ ...cloneDeep(ADDRESS_RESULT_INIT) });
        return;
      }

      const emailHash = hashEmail(sanitizedInput);

      const map = await fetchAccountMapEntryByEmailHash(emailHash);

      /** unknown e-mails may proceed in case of timed transfers */
      if (!map && isTimedTransfer) {
        setSuccess('Valid new e-mail');
        setAddressResult({ ...cloneDeep(ADDRESS_RESULT_INIT), emailHash, rawInput: sanitizedInput });
        return;
      }

      if (!map) {
        setError('Recipient not found');
        setAddressResult({ ...cloneDeep(ADDRESS_RESULT_INIT) });
        return;
      }

      /** File has been sent here before, but account has not been initialized yet */
      if (!map.binaryAddress) {
        setSuccess('Valid email');
        setAddressResult({ ...cloneDeep(ADDRESS_RESULT_INIT), emailHash, rawInput: sanitizedInput });
        return;
      }

      const account = await fetchUser(map.binaryAddress);

      if (account) {
        setSuccess('Valid address');
        setAddressResult({ emailHash, account, rawInput: sanitizedInput, username: map.username });
        return;
      }

      /** fallback to not found */
      setError('Recipient not found');
      setAddressResult({ ...cloneDeep(ADDRESS_RESULT_INIT) });
    };

    const validateInputAsUsername = async () => {
      const sanitizedInput = input.toLocaleLowerCase();

      if (userAccount?.storage.map.username.toLocaleLowerCase() === sanitizedInput) {
        setError('Can not use own address');
        setAddressResult({ ...cloneDeep(ADDRESS_RESULT_INIT) });
        return;
      }

      const map = await fetchAccountMapEntryByUsername(sanitizedInput);

      if (!map) {
        setError('Recipient not found');
        setAddressResult({ ...cloneDeep(ADDRESS_RESULT_INIT) });
        return;
      }

      const account = await fetchUser(map.binaryAddress);
      if (account) {
        setAddressResult({ emailHash: map.emailHash, account, rawInput: sanitizedInput, username: map.username });
        setSuccess('Valid username');
        return;
      }

      /** fallback to not found */
      setError('Recipient not found');
      setAddressResult({ ...cloneDeep(ADDRESS_RESULT_INIT) });
    };

    const id = setTimeout(() => {
      if (!input) {
        return;
      }

      if (isEmail(input)) {
        validateInputAsEmail();
      } else {
        validateInputAsUsername();
      }
    }, DEBOUNCE);

    return () => {
      clearTimeout(id);
    };
  }, [input, user?.email, setAddressResult, isTimedTransfer, wallet?.binaryAddress, userAccount?.storage.map.username]);

  return (
    <label className="block">
      <Label text="Recipient E-mail or Username" />

      <input
        placeholder="Enter an e-mail or username"
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
