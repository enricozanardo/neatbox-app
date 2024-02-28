import { useAuth0 } from '@auth0/auth0-react';
import { useQuery } from '@tanstack/react-query';

import Empty from 'components/ui/Empty';
import Error from 'components/ui/Error';
import PageTitle from 'components/ui/PageTitle';
import SEO from 'components/ui/SEO';
import useAccountData from 'hooks/useAccountData';
import useWallet from 'hooks/useWallet';
import NotFoundPage from 'pages/NotFoundPage';
import { getFileById } from 'services/api';
import { handleError } from 'utils/errors';
import { devLog, fileIsTimedTransfer, isSameAddress } from 'utils/helpers';

import FileCard from './FileCard';
import FileHistory from './FileHistory';
import FileRequests from './FileRequests';

type Props = {
  id: string;
};

const View = ({ id }: Props) => {
  const { wallet } = useWallet();
  const { account } = useAccountData();
  const { isAuthenticated } = useAuth0();

  const { isError, data } = useQuery({
    queryKey: ['view', id],
    queryFn: () => getFileById(id),
    onSuccess: data => devLog(data),
    onError: handleError,
  });

  const file = data;

  if (!file) {
    return <NotFoundPage />;
  }

  if (isError) {
    return <Error />;
  }

  const isOwner = !!(isAuthenticated && file && isSameAddress(file.data.owner, wallet?.lsk32address));
  const isAllowed = !!account?.filesAllowed.includes(id);

  return (
    <div>
      <SEO pageTitle={file?.data.title ?? 'View'} />
      <PageTitle text="File Information" />

      {!file && <Empty />}
      {file && <FileCard file={file} isOwner={isOwner} isAllowed={isAllowed} />}
      {file && !isOwner && isAuthenticated && !fileIsTimedTransfer(file) && !file.meta.collection.title && (
        <FileRequests file={file} isAllowed={isAllowed} />
      )}
      {file && (
        <FileHistory history={file.data.history.sort((a, b) => (b.createdAt.unix > a.createdAt.unix ? 1 : -1))} />
      )}
    </div>
  );
};

export default View;
