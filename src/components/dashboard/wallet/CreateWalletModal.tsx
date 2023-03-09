import Button from 'components/ui/Button';
import Clipboard from 'components/ui/Clipboard';
import Hr from 'components/ui/Hr';
import Icon from 'components/ui/Icon';
import Modal from 'components/ui/Modal';
import { useEffect, useState } from 'react';
import { useWalletStore } from 'stores/useWalletStore';
import { generatePassphrase } from 'utils/crypto';
import { getClasses, shuffleArray } from 'utils/helpers';

type Props = {
  isOpen: boolean;
  handleClose: () => void;
};

type Steps = 'start' | 'passphraseCheck' | 'secondPassphraseCheck' | 'confirm';

const Disclaimer = () => {
  return (
    <div className="flex gap-4">
      <Icon type="faBug" className="mt-1" />

      <p className="align-middle text-xs text-gray-500">
        The passphrase will not be stored anywhere, but it should be the responsibility of the wallet owner to store it
        locally and securely, maybe making multiple copies, respecting the word order. If it is lost, username@gmail.com
        access to the wallet is compromised and it will be both technologically and economically impossible to reclaim
        it.
      </p>
    </div>
  );
};

const PassphraseCheck = ({
  word,
  wordNumber,
  setNextStep,
  reset,
}: {
  word: string;
  wordNumber: string;
  setNextStep: () => void;
  reset: () => void;
}) => {
  const [words, setWords] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const words = generatePassphrase().split(' ').slice(0, -1);
    words.push(word);
    shuffleArray(words);
    setWords(words);
  }, [word]);

  const handleChangeInput = (value: string) => {
    setError('');
    setInput(value);
  };

  const validateInput = () => {
    setError('');

    if (input === word) {
      setNextStep();
    }

    setError('Incorrect word');
  };

  return (
    <>
      <div className="text-center">
        <div className="font-semibold">Please enter the {wordNumber} word of your passphrase</div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-12">
          {words.map(w => (
            <div
              key={w}
              className={getClasses(
                input === w ? 'bg-secondary-100' : '',
                'border border-dashed rounded-xl p-4 cursor-pointer',
              )}
              onClick={() => handleChangeInput(w)}
            >
              {w}
            </div>
          ))}
        </div>

        {<p className="text-red-400 text-sm my-4 font-bold">{error}</p>}
      </div>

      <div className="flex justify-center gap-4 mt-12 mb-8">
        <Button onClick={reset} color="primary-bordered">
          Reset
        </Button>
        <Button onClick={validateInput}>Validate</Button>
      </div>
    </>
  );
};

const CreateWalletModal = ({ isOpen, handleClose }: Props) => {
  const addWalletViaPassphrase = useWalletStore(state => state.addWalletViaPassphrase);
  const [step, setStep] = useState<Steps>('start');
  const [passphrase, setPassphrase] = useState('');

  const handleGeneratePassphrase = () => {
    const pass = generatePassphrase();
    setPassphrase(pass);
  };

  const reset = () => {
    setStep('start');
    setPassphrase('');
  };

  const updateWallet = () => {
    addWalletViaPassphrase(passphrase);
    handleClose();
  };

  return (
    <Modal title="Create Wallet" isOpen={isOpen} handleClose={handleClose}>
      {step === 'start' && (
        <>
          <div className="text-center font-semibold">Generate a new passphrase</div>

          <div className="relative">
            <input disabled placeholder="" value={passphrase} type="text" className="base-input" />
            <span className="absolute right-1 top-2 flex items-center pr-2">
              <Clipboard value={passphrase} className="text-gray-400" />
            </span>
          </div>

          <div className="flex justify-center gap-4 my-8">
            <Button onClick={handleGeneratePassphrase}>Generate</Button>

            <Button disabled={!passphrase} onClick={() => setStep('passphraseCheck')}>
              Next
            </Button>
          </div>
        </>
      )}

      {step === 'passphraseCheck' && (
        <PassphraseCheck
          word={passphrase.split(' ')[3]}
          wordNumber="4th"
          setNextStep={() => setStep('secondPassphraseCheck')}
          reset={reset}
        />
      )}

      {step === 'secondPassphraseCheck' && (
        <PassphraseCheck
          word={passphrase.split(' ')[9]}
          wordNumber="10th"
          setNextStep={() => setStep('confirm')}
          reset={reset}
        />
      )}

      {step === 'confirm' && (
        <div className="text-center mb-8">
          <p className="mb-8 font-semibold">Wallet created successfully!</p>
          <Button size="lg" onClick={updateWallet}>
            Go to Profile
          </Button>
        </div>
      )}

      <Hr />
      <Disclaimer />
    </Modal>
  );
};

export default CreateWalletModal;
