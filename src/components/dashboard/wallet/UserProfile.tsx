import { User } from '@auth0/auth0-react';
import pictureFallback from 'assets/img/user-fallback.png';
import { useState } from 'react';
import { AccountProps } from 'types';

type Props = {
  user: User;
  account: AccountProps | undefined;
};

const UserProfile = ({ user, account }: Props) => {
  const [profilePicture, setProfilePicture] = useState(user.picture || pictureFallback);

  const setFallback = () => {
    setProfilePicture(pictureFallback);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="mb-8">
        <div className="flex justify-center">
          <img src={profilePicture} onError={setFallback} className="rounded-full w-32 mt-0 mb-4" alt="Profile" />
        </div>

        <div className="font-bold text-2xl text-center">{user.name}</div>
      </div>

      <div className="text-center">
        {account?.username && (
          <div className="mb-4">
            <span className="label text-sm block">Username</span>
            {account.username}
          </div>
        )}

        <div className="mb-4">
          <span className="label text-sm block">Email Address</span>
          {user.email}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
