import { cryptography, passphrase } from '@liskhq/lisk-client/browser';
import { Buffer } from 'buffer';
import crypto, { SHA256 } from 'crypto-js';
import { FileWithPath } from 'react-dropzone';

import config from 'config';
import { Wallet } from 'types';

export const generateWallet = async (passphraseInput?: string): Promise<Wallet> => {
  const passphrase = passphraseInput ?? generatePassphrase();

  const privateKey = await cryptography.ed.getPrivateKeyFromPhraseAndPath(passphrase, config.DERIVATION_PATH);

  const publicKey = cryptography.ed.getPublicKeyFromPrivateKey(privateKey);
  const address = cryptography.address.getAddressFromPrivateKey(privateKey);

  return {
    lsk32address: cryptography.address.getLisk32AddressFromAddress(address),
    publicKey: bufferToHex(publicKey),
    passphrase: passphrase,
  };
};

export const getLisk32AddressFromPassphrase = async (passphrase: string) => {
  const privateKey = await cryptography.ed.getPrivateKeyFromPhraseAndPath(passphrase, config.DERIVATION_PATH);
  const address = cryptography.address.getAddressFromPrivateKey(privateKey);

  return cryptography.address.getLisk32AddressFromAddress(address);
};

export const getLisk32AddressFromAddress = (address: Buffer) => {
  return cryptography.address.getLisk32AddressFromAddress(address);
};

export const generatePassphrase = () => {
  return passphrase.Mnemonic.generateMnemonic();
};

export const validatePassphrase = (input: string) => {
  const errors = passphrase.validation.getPassphraseValidationErrors(input);

  return errors;
};

export const bufferToHex = (input: Buffer) => {
  return input.toString('hex');
};

export const hexToBuffer = (input: string) => {
  return cryptography.utils.hexToBuffer(input);
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

export const hashEmail = (input: string) => SHA256(input.toLocaleLowerCase()).toString(crypto.enc.Hex);
