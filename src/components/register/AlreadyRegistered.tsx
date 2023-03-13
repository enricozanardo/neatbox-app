import { Link } from 'react-router-dom';

const AlreadyRegistered = () => {
  return (
    <div className="flex justify-center items-center h-full  text-center">
      <div className="w-full space-y-8">
        <h2>Welcome back!</h2>

        <div className="font-bold">
          <p>It seems that your e-mail is already registered.</p>
        </div>

        <p className="text-xs">
          Import your wallet on your <Link to="/dashboard">dashboard</Link>.
        </p>
      </div>
    </div>
  );
};

export default AlreadyRegistered;
