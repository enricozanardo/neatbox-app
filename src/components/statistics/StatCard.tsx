import Image from 'components/ui/Image';
import Statistic from 'components/ui/Statistic';

type Props = {
  image?: string;
  label: string;
  value: number;
};

const StatCard = ({ image, label, value }: Props) => {
  return (
    <div className="rounded-xl shadow-lg bg-white border-2 border-gray-00 p-4 w-full mb-24 lg:mb-0">
      <div className="flex justify-center">
        <Image
          src={
            image ||
            `https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80`
          }
          className="-mt-16 w-5/6"
        />
      </div>

      <div className="flex justify-center mt-8 mb-12">
        <Statistic label={label} value={value} />
      </div>
    </div>
  );
};

export default StatCard;
