import axios from 'axios';
import config from 'config';
import { devLog } from 'utils/helpers';

export const getAxios = () => {
  return axios;
};

type DamEndpoint = 'download' | 'upload' | 'delete' | 'transfer-file' | 'transfer-collection';

export const buildDamUrl = (endpoint: DamEndpoint) => {
  const baseUrl = config.DAM_API;

  if (!baseUrl) {
    throw Error('No API specified');
  }

  return `${baseUrl}/${endpoint}`;
};

export const sendTimedTransferMail = async (data: {
  from: string;
  to: string;
  filename: string;
  expiration: number;
}) => {
  const url = `${config.EMAIL_API}/timed-transfer`;

  await getAxios().post(url, data);
};

export const sendInitializeAccountCommand = (data: { passphrase: string; username: string; emailHash: string }) => {
  const url = `${config.ACCOUNT_INITIALIZER}/initialize`;

  return getAxios().post(url, data);
};

/** helpers */
export const handleLoadingProgress = (
  e: ProgressEvent,
  setLoadingProgress: (value: React.SetStateAction<number>) => void,
) => {
  const progress = (e.loaded / e.total) * 100;
  devLog(`Loaded: ${e.loaded}, Total: ${e.total}, Progress: ${progress}`);
  setLoadingProgress(Math.round(progress));
};
