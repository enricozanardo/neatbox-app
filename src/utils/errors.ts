import { toast } from 'react-hot-toast';

import { devLog } from './helpers';

export const handleError = (error: unknown) => {
  let message = 'Something went wrong';

  devLog(error);

  if (typeof error === 'string') {
    message = error;
  }

  if (error instanceof Error) {
    message = error.message;
  }

  toast.error(message);
};
