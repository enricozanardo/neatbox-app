import { faDiscord, faGithub, faTelegram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faCopy, faFolder } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowLeft,
  faArrowUp,
  faBook,
  faBug,
  faCheck,
  faCircle,
  faCircleInfo,
  faCircleNotch,
  faClock,
  faCloudArrowUp,
  faDog,
  faDownload,
  faEdit,
  faEnvelope,
  faFile,
  faFont,
  faImage,
  faList,
  faLock,
  faRightLeft,
  faSpinner,
  faStar,
  faTrash,
  faUser,
  faUserGroup,
  faUserTie,
  faVideo,
  faVolumeHigh,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
  type: keyof typeof icons;
  className?: string;
};

const icons = {
  faEnvelope,
  faDiscord,
  faTwitter,
  faTelegram,
  faGithub,
  faBook,
  faArrowLeft,
  faCircle,
  faArrowUp,
  faCircleNotch,
  faCircleInfo,
  faDog,
  faSpinner,
  faBug,
  faCloudArrowUp,
  faLock,
  faCopy,
  faTrash,
  faFolder,
  faCheck,
  faImage,
  faVideo,
  faFont,
  faFile,
  faVolumeHigh,
  faDownload,
  faEdit,
  faUserGroup,
  faUser,
  faUserTie,
  faStar,
  faList,
  faClock,
  faRightLeft,
};

const Icon = ({ type, className }: Props) => {
  return <FontAwesomeIcon icon={icons[type]} className={className} />;
};

export default Icon;
