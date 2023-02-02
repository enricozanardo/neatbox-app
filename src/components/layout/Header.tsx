import { useAuth0 } from '@auth0/auth0-react';
import logoBox from 'assets/img/neatbox-logo-box.png';
import logoFull from 'assets/img/neatbox-logo-full.png';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAccountStore } from 'stores/useAccountStore';
import { getClasses } from 'utils/helpers';

import LogInButton from './LogInButton';

const navigation = [
  { name: 'Browse', href: '/browse', requiresAuth: false },
  { name: 'Upload', href: '/upload', requiresAuth: true },
  { name: 'Transfer', href: '/transfer', requiresAuth: true },
  { name: 'Collections', href: '/collections', requiresAuth: true },
  { name: 'Requests', href: '/requests', requiresAuth: true },
  { name: 'Dashboard', href: '/dashboard', requiresAuth: true },
];

const Header = () => {
  const [menuIsOpen, setMenuIsOpen] = useState(true);
  const account = useAccountStore(state => state.account);
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth0();

  const toggleMenu = () => {
    setMenuIsOpen(!menuIsOpen);
  };

  useEffect(() => {
    setMenuIsOpen(false);
  }, [pathname]);

  const isActivePage = (path: string) => {
    return pathname === path;
  };

  const openRequests = account
    ? account.storage.incomingFileRequests.length + account.storage.incomingCollectionRequests.length
    : 0;
  const navItems = navigation.filter(n => n.requiresAuth === false || (isAuthenticated && n.requiresAuth));

  return (
    <header>
      <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded">
        <div className="container flex flex-wrap items-center justify-between mx-auto">
          <Link to="/">
            <img src={logoFull} alt="logo" className="md:h-16  hidden lg:block" />

            <img src={logoBox} alt="logo" className="ml-2 h-12 lg:hidden" />
          </Link>

          <button
            data-collapse-toggle="navbar-default"
            type="button"
            onClick={toggleMenu}
            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              // fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>

          {/* <div className="hidden w-full md:block md:w-auto" id="navbar-default"> */}
          <div className={getClasses(menuIsOpen ? '' : 'hidden', 'w-full md:block md:w-auto ')} id="navbar-default">
            <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:bg-transparent md:flex-row md:space-x-5 lg:space-x-6 xl:space-x-8 md:mt-0 md:text-sm md:border-0">
              {navItems.map(nav => (
                <li className="mb-2 md:mb-0 md:mt-1 lg:scale-110" key={nav.name}>
                  <Link
                    to={nav.href}
                    className={getClasses(
                      isActivePage(nav.href) ? 'underline' : '',
                      'relative underline-offset-2 uppercase decoration-4 active:underline hover:underline decoration-primary-400 text-black z-10',
                    )}
                  >
                    <div className="z-20">{nav.name}</div>
                  </Link>

                  {nav.name === 'Requests' && openRequests > 0 && (
                    <div className="opacity-70 inline-flex absolute ml-20 -mt-8 md:-mt-[3.5em] md:ml-[7.6em] lg:mt-1 lg:ml-0 lg:mb-0 lg:-top-3 lg:-right-3 justify-center items-center w-4 h-4 text-xxs font-bold text-white bg-red-500 rounded-full z-0">
                      {openRequests}
                    </div>
                  )}
                </li>
              ))}

              <li className="mt-2 md:mt-0">
                <LogInButton />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
