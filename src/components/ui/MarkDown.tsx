import ReactMarkdown from 'react-markdown';

type Props = {
  children: string;
};

const MarkDown = ({ children }: Props) => {
  return (
    <div className={`max-w-screen-md prose prose-code:before:content-none prose-code:after:content-none`}>
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
};

export default MarkDown;
