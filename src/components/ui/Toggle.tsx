type Props = {
  isChecked: boolean;
  onCheck: () => void;
};

const Toggle = ({ isChecked, onCheck }: Props) => {
  return (
    <label className="inline-flex relative items-center cursor-pointer">
      <input type="checkbox" defaultChecked={isChecked} onChange={onCheck} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-secondary-300  rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-secondary-400"></div>
    </label>
  );
};

export default Toggle;
