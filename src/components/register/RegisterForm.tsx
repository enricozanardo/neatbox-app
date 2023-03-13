import Button from 'components/ui/Button';
import PageTitle from 'components/ui/PageTitle';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAccountMapEntryByUsername } from 'services/api';

const regex = /^[a-zA-Z]{1}[a-zA-Z0-9]{2,17}$/;
const DEBOUNCE = 500;

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isValidUsername = (username: string) => {
    setError('');
    setSuccess('');

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
      const map = await fetchAccountMapEntryByUsername(sanitizedInput);

      if (map) {
        setError('Username already exists');
      }

      setSuccess('Username is available');
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
    setSuccess('');
    setUsername(e.target.value.trim());
  };

  const onSubmit = () => {};

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
                {success && <span className="text-xs text-green-400">{success}</span>}
              </div>
            </label>
          </div>

          <Button type="submit">Register</Button>
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

export default RegisterForm;
