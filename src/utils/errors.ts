import { toast } from 'react-hot-toast';

export const handleError = (error: unknown) => {
  let message = 'Something went wrong';

  console.debug(error);

  if (typeof error === 'string') {
    message = error;
  }

  if (error instanceof Error) {
    message = error.message;
  }

  toast.error(message);
};