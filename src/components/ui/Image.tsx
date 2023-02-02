type Props = React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;

const Image = ({ alt, ...props }: Props) => {
  return <img alt={alt} {...props} className={`w-full rounded-3xl ${props.className}`} />;
};

export default Image;
