import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

import { devLog } from './helpers';

export const handleError = (error: unknown) => {
  let message = 'Something went wrong';

  devLog(error);

  if (typeof error === 'string') {
    message = error;
  } else if (error instanceof AxiosError) {
    message = error.response?.data || error.message;
  } else if (error instanceof Error) {
    if (error.message === 'Incoming transaction fee is not sufficient to replace existing transaction') {
      message = 'Previous action is still processing';
    } else {
      message = error.message;
    }
  }

  toast.error(message);
};
