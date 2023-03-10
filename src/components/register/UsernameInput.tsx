import { useEffect, useState } from 'react';
import { fetchAccountMapEntryByUsername } from 'services/api';
import { AccountProps } from 'types';

export type RecipientAccount = AccountProps | null | undefined;

type Props = {};

const DEBOUNCE = 500;

const UsernameInput = ({}: Props) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setError('');
    setSuccess('');

    const validateInputAsUsername = async () => {
      const sanitizedInput = input.toLocaleLowerCase();

      const map = await fetchAccountMapEntryByUsername(sanitizedInput);

      if (map) {
        setError('Username already exists');
      }
    };

    const id = setTimeout(() => {
      if (!input) {
        return;
      }

      validateInputAsUsername();
    }, DEBOUNCE);

    return () => {
      clearTimeout(id);
    };
  }, [input]);

  return (
    <label className="block">
      <input
        placeholder="Enter a username"
        value={input}
        onChange={e => setInput(e.target.value)}
        type="text"
        className="base-input"
        required
      />

      <div className="text-left">
        {error && <span className="text-xs text-red-400">{error}</span>}
        {success && <span className="text-xs text-green-400">{success}</span>}
      </div>
    </label>
  );
};

export default UsernameInput;
