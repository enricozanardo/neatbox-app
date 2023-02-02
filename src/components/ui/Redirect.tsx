import { Navigate } from 'react-router-dom';

type Props = {
  to?: string;
};

const Redirect = ({ to }: Props) => {
  return <Navigate replace to={to ?? '/'} />;
};

export default Redirect;
