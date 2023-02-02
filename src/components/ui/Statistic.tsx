type Props = {
  label: string;
  value: string | number;
};

const Statistic = ({ value, label }: Props) => {
  const getValue = () => {
    if (typeof value === 'number') {
      return value.toLocaleString();
    }

    return value;
  };

  return (
    <div className="space-y-3 text-center">
      <h3>{label}</h3>
      <span className="uppercase underline decoration-8 decoration-primary-400 underline-offset-4 text-6xl block">
        {getValue()}
      </span>
    </div>
  );
};

export default Statistic;
