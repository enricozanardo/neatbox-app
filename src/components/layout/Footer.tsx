import secureLogo from 'assets/img/neatbox-secure-logo.png';
import Icon from 'components/ui/Icon';
import config from 'config';
import { useClientStatusStore } from 'stores/useClientStatusStore';
import { getCurrentYear } from 'utils/helpers';

const Footer = () => {
  const { clientIsOnline } = useClientStatusStore();

  return (
    <footer className="flex justify-center items-center bg-primary-50">
      <div className="text-center">
        <div className="text-black mb-4 flex justify-center">
          <img src={secureLogo} alt="Neatbox Secure Logo" className="w-40" />
        </div>

        <div className="text-sm font-thin">
          <p className="mb-4">
            Network Status:{' '}
            <span className="text-xs">
              <Icon type="faCircle" className={clientIsOnline ? 'text-green-400' : 'text-red-400'} />
            </span>
          </p>

          <div className="text-2xl mb-4 flex justify-center gap-8">
            <a
              href="https://discord.gg/placeholder"
              target="_blank"
              rel="noreferrer"
              aria-label="Discord"
              className="text-gray-400 hover:text-gray-800"
            >
              <Icon type="faDiscord" />
            </a>

            <a
              href="https://github.com/NeatboxHQ"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="text-gray-400 hover:text-gray-800"
            >
              <Icon type="faGithub" />
            </a>

            <a
              href="https://twitter.com/NeatboxHQ"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="text-gray-400 hover:text-gray-800"
            >
              <Icon type="faTwitter" />
            </a>

            <a
              href="mailto:info@neatbox.it"
              target="_blank"
              rel="noreferrer"
              aria-label="E-mail"
              className="text-gray-400 hover:text-gray-800"
            >
              <Icon type="faEnvelope" />
            </a>
          </div>

          <p className="mb-16">
            © {getCurrentYear()} {config.PROJECT_TITLE} - All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
