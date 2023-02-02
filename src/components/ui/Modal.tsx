import ReactModal from 'react-modal';

type Props = {
  title: string;
  isOpen: boolean;
  handleClose: () => void;
  children: any;
};

const customStyles: ReactModal.Styles = {
  overlay: {
    background: 'rgba(0,0,0, 0.3)',
  },
};

export default function Modal({ title, isOpen, handleClose, children }: Props) {
  return (
    <ReactModal
      ariaHideApp={false}
      isOpen={isOpen}
      onRequestClose={handleClose}
      style={customStyles}
      className="overflow-y-auto overflow-x-hidden z-50 w-full md:inset-0 h-modal md:h-full flex justify-center items-center"
      contentLabel={`${title} Modal`}
    >
      <div className="relative p-4 w-full max-w-4xl h-full md:h-auto">
        <div className="relative bg-white rounded-lg shadow">
          <div className="flex justify-between items-center p-5 rounded-t border-b">
            <h3 className="text-xl font-medium text-gray-900">{title}</h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              onClick={handleClose}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="leading-relaxed">{children}</div>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
