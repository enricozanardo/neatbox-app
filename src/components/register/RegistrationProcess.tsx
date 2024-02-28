import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Button from 'components/ui/Button';
import PageTitle from 'components/ui/PageTitle';
import useWallet from 'hooks/useWallet';
import { fetchMapByEmailOrUsername } from 'services/api';
import { sendInitializeAccountCommand } from 'services/axios';
import { generateWallet, hashEmail } from 'utils/crypto';
import { handleError } from 'utils/errors';

import CompletedScreen from './CompletedScreen';
import InitializationIndicator from './LoadingScreen';

const regex = /^[a-zA-Z]{1}[a-zA-Z0-9]{2,17}$/;
const DEBOUNCE = 500;

type Screen = 'start' | 'initializing' | 'completed' | 'failed';

type Props = {
  email: string;
};

const RegistrationProcess = ({ email }: Props) => {
  const { addWallet } = useWallet();
  const [screen, setScreen] = useState<Screen>('start');

  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [available, setAvailable] = useState('');

  const isValidUsername = (username: string) => {
    setError('');
    setAvailable('');

    if (username.length === 0) {
      setUsername(username);
      return;
    }

    if (!/^[a-zA-Z]{1}/.test(username)) {
      setError('Invalid username (must begin with letter)');
    } else if (username.length < 3) {
      setError('Invalid username (min length: 3)');
    } else if (username.length > 18) {
      setError('Invalid username (max length: 18)');
    } else if (!regex.test(username)) {
      setError('Invalid username (illegal characters)');
    }

    setUsername(username);

    return regex.test(username);
  };

  useEffect(() => {
    const validateUsernameOnNetwork = async () => {
      if (!regex.test(username)) {
        return;
      }

      const sanitizedInput = username.toLocaleLowerCase();
      const mapByUsername = await fetchMapByEmailOrUsername({ username: sanitizedInput });

      if (mapByUsername) {
        setError('Username already exists');
        return;
      }

      setAvailable('Username is available');
    };

    const id = setTimeout(() => {
      if (!isValidUsername(username)) {
        return;
      }
      validateUsernameOnNetwork();
    }, DEBOUNCE);

    return () => {
      clearTimeout(id);
    };
  }, [username]);

  const handleUsernameUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setAvailable('');
    setUsername(e.target.value.trim());
  };

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const newWallet = await generateWallet();
    const emailHash = hashEmail(email);

    try {
      setScreen('initializing');
      addWallet(newWallet);

      await sendInitializeAccountCommand({
        passphrase: newWallet.passphrase,
        username: username.toLowerCase(),
        emailHash,
      });

      setTimeout(() => {
        setScreen('completed');
      }, 10000);
    } catch (err) {
      handleError(err);
      setScreen('start');
    }
  };

  if (screen === 'initializing') {
    return <InitializationIndicator />;
  }

  if (screen === 'completed') {
    return <CompletedScreen />;
  }

  return (
    <div className="flex justify-center items-center h-full  text-center">
      <div className="w-full">
        <PageTitle text="Welcome!" />

        <div className="font-bold mb-10"></div>

        <form onSubmit={onSubmit} className="mb-10">
          <div className="h-28">
            <p className="font-bold mb-4">To get started, please enter a username.</p>
            <label className="block">
              <input
                placeholder="Enter a username"
                value={username}
                onChange={handleUsernameUpdate}
                type="text"
                className="base-input"
                required
              />

              <div className="text-left">
                {error && <span className="text-xs text-red-400">{error}</span>}
                {available && <span className="text-xs text-green-400">{available}</span>}
              </div>
            </label>
          </div>

          <Button type="submit" disabled={!!!available}>
            Register
          </Button>
        </form>

        <p className="text-xs">
          Already registered?
          <br />
          Import your wallet on your <Link to="/dashboard">dashboard</Link>.
        </p>
      </div>
    </div>
  );
};

export default RegistrationProcess;
