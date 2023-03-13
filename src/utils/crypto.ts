import { cryptography, passphrase } from '@liskhq/lisk-client/browser';
import crypto, { SHA256 } from 'crypto-js';
import { FileWithPath } from 'react-dropzone';
import { Wallet } from 'types';

export const generateWallet = (passphraseInput?: string): Wallet => {
  const passphrase = passphraseInput ?? generatePassphrase();

  return {
    liskAddress: cryptography.getBase32AddressFromPassphrase(passphrase),
    binaryAddress: cryptography.getAddressFromPassphrase(passphrase).toString('hex'),
    publicKey: cryptography.getAddressAndPublicKeyFromPassphrase(passphrase).publicKey.toString('hex'),
    passphrase: passphrase,
  };
};

export const generatePassphrase = () => {
  return passphrase.Mnemonic.generateMnemonic();
};

export const validatePassphrase = (input: string) => {
  const errors = passphrase.validation.getPassphraseValidationErrors(input);

  return errors;
};

export const bufferToHex = (input: Buffer) => {
  return cryptography.bufferToHex(input);
};

export const hexToBuffer = (input: string) => {
  return cryptography.hexToBuffer(input);
};

export const generateChecksum = (file: FileWithPath): Promise<string> => {
  return new Promise(resolve => {
    const reader = new FileReader();

    reader.readAsBinaryString(file);

    reader.onloadend = () => {
      // @ts-ignore
      const hash = SHA256(crypto.enc.Latin1.parse(reader.result)).toString(crypto.enc.Hex);
      resolve(hash);
    };
  });
};

export const getPublicKeyFromPassphrase = (passphrase: string) => {
  return cryptography.getAddressAndPublicKeyFromPassphrase(passphrase).publicKey.toString('hex');
};

export const hashEmail = (input: string) => SHA256(input.toLocaleLowerCase()).toString(crypto.enc.Hex);
