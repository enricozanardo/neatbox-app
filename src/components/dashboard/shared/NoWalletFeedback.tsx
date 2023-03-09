import Icon from 'components/ui/Icon';

export const NoWalletFeedback = () => {
  return (
    <div className="text-center text-gray-400 text-sm">
      <Icon type="faBug" /> Create or import a wallet to view this data
    </div>
  );
};
