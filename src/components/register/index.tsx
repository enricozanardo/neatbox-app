import Button from 'components/ui/Button';
import PageTitle from 'components/ui/PageTitle';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import UsernameInput from './UsernameInput';

const regex = /[a-zA-Z0-9]{3,24}/;

const Register = () => {
  const [username, setUsername] = useState('');
  const onSubmit = () => {};
  return (
    <div className="flex justify-center items-center h-full  text-center">
      <div className="w-full">
        <PageTitle text="Welcome!" />

        <div className="font-bold mb-10">
          <p>To get started, please pick a username.</p>
        </div>

        <form onSubmit={onSubmit} className="mb-10">
          <UsernameInput />

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

export default Register;
