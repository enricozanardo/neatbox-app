type Props = {
  text: string;
};

const Label = ({ text }: Props) => {
  return <span className="label text-sm md:text-base">{text}</span>;
};

export default Label;
