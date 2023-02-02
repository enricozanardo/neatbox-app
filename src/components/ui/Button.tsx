import { getClasses } from 'utils/helpers';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: 'sm' | 'md' | 'lg';
  classes?: string;
  link?: boolean;
};

const Button = (props: Props) => {
  const getButtonStyle = () => {
    if (props.disabled) {
      return 'border-2 border-gray-300 bg-transparent text-gray-300';
    }

    switch (props.color) {
      case 'primary':
        return 'border-2 border-primary-300 bg-primary-300 hover:bg-primary-400 hover:border-primary-400';
      case 'primary-bordered':
        return 'border-2 border-primary-400 bg-transparent text-primary-500 hover:border-primary-500 hover:text-primary-600';
      case 'secondary':
        return 'border-2 bg-secondary-300 hover:bg-secondary-400';
      case 'secondary-bordered':
        return 'border-2 border-secondary-400 bg-transparent text-secondary-400 hover:border-secondary-500 hover:text-secondary-500';
      case 'danger':
        return 'border-2 bg-red-300 hover:bg-red-400';
      case 'danger-bordered':
        return 'border-2 border-red-400 bg-transparent text-red-400 hover:border-red-500 hover:text-red-500';
      default:
        return 'border-2 border-primary-300 bg-primary-300 hover:bg-primary-400 hover:border-primary-400';
    }
  };

  if (props.link) {
    return (
      <button
        className={getClasses('text-blue-400 hover:underline font-sans', props.className)}
        type="button"
        onClick={props.onClick}
      >
        {props.children}
      </button>
    );
  }

  return (
    <button
      {...props}
      className={getClasses(
        'uppercase py-1 px-4 rounded-xl',
        getButtonStyle(),
        props.size === 'lg' ? 'text-2xl py-2 px-8' : '',
        props.size === 'sm' ? 'text-sm py-1 px-2' : '',
        props.className,
      )}
    >
      {props.children}
    </button>
  );
};

export default Button;
