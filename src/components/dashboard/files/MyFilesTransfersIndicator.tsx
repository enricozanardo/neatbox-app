import TransferConfirmationSpinner from 'components/ui/TransferConfirmationSpinner';
import useAccountData from 'hooks/useAccountData';
import { useEffect, useRef, useState } from 'react';

type Props = {
  fileId: string | null;
};

const MyFilesTransfersIndicator = ({ fileId }: Props) => {
  const { account } = useAccountData();
  const [isProcessing, setIsProcessing] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  };

  useEffect(() => {
    if (fileId) {
      setIsProcessing(true);
    }

    timeout.current = setTimeout(() => {
      setIsProcessing(false);
      clearTimer();
    }, 10000 + 5000);
  }, [fileId]);

  useEffect(() => {
    if (fileId && account?.storage.filesOwned && account.storage.filesOwned.includes(fileId)) {
      setIsProcessing(false);
      clearTimer();
    }
  }, [account?.storage.filesOwned, fileId]);

  useEffect(() => {
    return () => clearTimer();
  }, []);

  if (!isProcessing) {
    return null;
  }

  return <TransferConfirmationSpinner />;
};

export default MyFilesTransfersIndicator;
