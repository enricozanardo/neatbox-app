type Props = {
  text: string;
};

const PageTitle = ({ text }: Props) => {
  return <h1 className="text-center mt-0 mb-16 uppercase">{text}</h1>;
};

export default PageTitle;
