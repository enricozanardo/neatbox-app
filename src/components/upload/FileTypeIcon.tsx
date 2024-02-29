import Icon from 'components/ui/Icon';
import { NeatboxFile } from 'types';

type Props = {
  file: NeatboxFile;
};

const FileTypeIcon = ({ file }: Props) => {
  const primaryType = file.data.type.split('/')[0];

  if (primaryType === 'audio') {
    return <Icon type="faVolumeHigh" />;
  }

  if (primaryType === 'image') {
    return <Icon type="faImage" />;
  }

  if (primaryType === 'video') {
    return <Icon type="faVideo" />;
  }

  if (primaryType === 'text') {
    return <Icon type="faFont" />;
  }

  return <Icon type="faFile" />;
};

export default FileTypeIcon;
