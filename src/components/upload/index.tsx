import { useAuth0 } from '@auth0/auth0-react';
import AddressInput, { ADDRESS_RESULT_INIT } from 'components/ui/AddressInput';
import Label from 'components/ui/Label';
import PageTitle from 'components/ui/PageTitle';
import SuccessScreen from 'components/ui/SuccessScreen';
import Toggle from 'components/ui/Toggle';
import config from 'config';
import { cloneDeep } from 'lodash';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { FileWithPath } from 'react-dropzone';
import toast from 'react-hot-toast';
import { invokeAction, invokeSafeAction } from 'services/api';
import { buildDamUrl, getAxios, handleLoadingProgress, sendTimedTransferMail } from 'services/axios';
import { sendCreateFileAsset, sendTimedTransferAsset } from 'services/transactions';
import useWallet from 'hooks/useWallet';
import { ApiAction, CreateFileAssetProps, TimedTransferAssetProps } from 'types';
import { handleError } from 'utils/errors';
import { getTransactionTimestamp, isEmail, jsonToBuffer } from 'utils/helpers';

import CustomFields, { CustomField } from './CustomFields';
import Drop from './Drop';
import UploadButton from './UploadButton';
import UploadStatus from './UploadStatus';

const FORM_INIT = {
  file: null as File | null,
  title: '',
  checksum: '',
  transferFee: 100,
  accessPermissionFee: 10,
  isPrivate: false,
  isTimedTransfer: false,
};

const Upload = () => {
  const { wallet } = useWallet();
  const { isAuthenticated, user } = useAuth0();

  const [form, setForm] = useState(cloneDeep(FORM_INIT));
  const [addressResult, setAddressResult] = useState(cloneDeep(ADDRESS_RESULT_INIT));
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  const [success, setSuccess] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);

  const updateForm = (field: keyof typeof FORM_INIT, value: any) => {
    if (typeof value !== typeof form[field]) {
      console.error('Invalid value type');
      return;
    }

    setForm(prevState => ({ ...prevState, [field]: value }));
  };

  const handleFileChange = async (newFile?: FileWithPath, newChecksum?: string) => {
    updateForm('file', newFile || null);
    updateForm('checksum', newChecksum || '');

    if (newFile) {
      updateForm('title', newFile.name.split('.')[0] || 'New file');
    }
  };

  /** Prevent user file size abuse */
  useEffect(() => {
    if (!form.isTimedTransfer && form.file && form.file.size > config.MAX_UPLOAD_FILE_SIZE) {
      updateForm('file', null);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.isTimedTransfer, form.file]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const timestamp = DateTime.now().toUTC().toUnixInteger() - 10;
    const { file, checksum, title, isPrivate, transferFee, accessPermissionFee, isTimedTransfer } = form;

    try {
      if (!wallet) {
        throw new Error('No wallet present');
      }

      if (!file) {
        throw new Error('No file selected');
      }

      if (transferFee < 1 || accessPermissionFee < 1) {
        throw new Error('Fee must be at least 1');
      }

      const fileExists = await invokeSafeAction(ApiAction.GetFileByChecksum, { checksum });

      if (fileExists) {
        throw new Error('File already exists');
      }

      if (isTimedTransfer && !addressResult.emailHash) {
        throw new Error('Invalid recipient');
      }

      const formData = new FormData();
      formData.append('password', wallet.publicKey);
      formData.append('file', file, file.name);
      formData.append('expiration', isTimedTransfer ? timestamp.toString() : '0');

      setLoadingStatus('Uploading file');

      const response = await getAxios().post(buildDamUrl('upload'), formData, {
        onUploadProgress: e => handleLoadingProgress(e, setLoadingProgress),
      });

      setLoadingStatus('Adding file to blockchain');

      const { name, size, type } = file;
      const finalCustomFields = jsonToBuffer(isPrivate ? [] : customFields);

      if (isTimedTransfer) {
        const timestamp = getTransactionTimestamp();

        const asset: TimedTransferAssetProps = {
          title,
          name,
          size,
          type,
          checksum,
          hash: response.data.encryptedHash,
          customFields: finalCustomFields,
          transferFee,
          accessPermissionFee: 0,
          recipientEmailHash: addressResult.account ? addressResult.account.email : addressResult.emailHash,
          timestamp,
          private: isPrivate,
        };

        await sendTimedTransferAsset(wallet.passphrase, asset);
        toast.success('Timed Transfer submitted!');

        if (isEmail(addressResult.rawInput)) {
          const mailData = {
            from: user?.email || 'Unknown Sender',
            to: addressResult.rawInput,
            filename: name,
            expiration: timestamp + 604800,
          };

          await sendTimedTransferMail(mailData).catch(err => {
            toast.error('Could not send e-mail');
            console.error(err);
          });
        }
      }

      if (!isTimedTransfer) {
        const asset: CreateFileAssetProps = {
          title,
          name,
          size,
          type,
          checksum,
          hash: response.data.encryptedHash,
          customFields: finalCustomFields,
          transferFee,
          accessPermissionFee,
          private: isPrivate,
          timestamp,
        };

        await sendCreateFileAsset(wallet.passphrase, asset);
        toast.success('File uploaded!');
      }

      setLoadingStatus('');
      setSuccess(true);
    } catch (err) {
      setLoadingStatus('');
      handleError(err);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setCustomFields([]);
    setAddressResult(cloneDeep(ADDRESS_RESULT_INIT));
    setForm(cloneDeep(FORM_INIT));
  };

  if (!success && loadingStatus) {
    return <UploadStatus heading={loadingStatus} progress={loadingProgress} />;
  }

  if (success) {
    return <SuccessScreen reset={handleReset} type="Upload" />;
  }

  return (
    <>
      <PageTitle text="Upload File" />

      <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10 lg:space-y-12">
        <Drop file={form.file} handleFileChange={handleFileChange} isTimedTransfer={form.isTimedTransfer} />

        <div className="flex gap-4 md:gap-6 lg:gap-8">
          <label className="block w-1/2">
            <Label text="Timed Transfer" />

            <div className="mt-2">
              <Toggle
                isChecked={form.isTimedTransfer}
                onCheck={() => updateForm('isTimedTransfer', !form.isTimedTransfer)}
              />
            </div>
          </label>
          <label className="block w-1/2">
            <Label text="Private" />
            <div className="mt-2">
              <Toggle isChecked={form.isPrivate} onCheck={() => updateForm('isPrivate', !form.isPrivate)} />
            </div>
          </label>
        </div>

        <label className="block">
          <Label text="Title" />
          <input
            placeholder="Enter a title"
            value={form.title}
            onChange={e => updateForm('title', e.target.value)}
            type="text"
            className="base-input"
            required
          />
        </label>

        <div className="flex gap-4 md:gap-6 lg:gap-8">
          <label className="block w-1/2">
            <Label text="Transfer Fee" />
            <div>
              <input
                min={1}
                id="transfer-input"
                type="number"
                value={form.transferFee}
                onChange={e => updateForm('transferFee', Number(e.target.value))}
                className="base-input mb-1 block"
              />
            </div>
          </label>
          <label className="block w-1/2">
            <Label text="Access Permission Fee" />
            <div>
              <input
                min={1}
                id="access-input"
                type="number"
                value={form.accessPermissionFee}
                onChange={e => updateForm('accessPermissionFee', Number(e.target.value))}
                className="base-input mb-1 block"
                disabled={form.isTimedTransfer}
              />
            </div>
          </label>
        </div>

        {form.isTimedTransfer && <AddressInput setAddressResult={setAddressResult} isTimedTransfer />}
        {!form.isPrivate && <CustomFields customFields={customFields} setCustomFields={setCustomFields} />}

        <UploadButton isAuthenticated={isAuthenticated} isTimedTransfer={form.isTimedTransfer} wallet={wallet} />
      </form>
    </>
  );
};

export default Upload;
