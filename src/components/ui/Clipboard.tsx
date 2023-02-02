import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getClasses } from 'utils/helpers';

import Icon from './Icon';

type Props = {
  value: string;
  className?: string;
};

const Clipboard = ({ value, className }: Props) => {
  const [copied, setCopied] = useState(false);

  const toggleCopied = () => {
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <CopyToClipboard text={value} onCopy={toggleCopied}>
      <div className={getClasses('inline', className)}>
        {copied ? <Icon type="faCheck" /> : <Icon type="faCopy" className="cursor-pointer" />}
      </div>
    </CopyToClipboard>
  );
};

export default Clipboard;
