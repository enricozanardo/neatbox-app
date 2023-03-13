import { transactions } from '@liskhq/lisk-client/browser';
import { DateTime } from 'luxon';
import prettyBytes from 'pretty-bytes';

export const displayNumber = (input: number | string) => Number(input).toLocaleString();

export const displayBalance = (input: bigint) => {
  const amount = Number(transactions.convertBeddowsToLSK(input.toString()));

  return amount % 1 === 0 ? amount : amount.toFixed(3);
};

export const displayFileSize = (input: number) => prettyBytes(input);

export const beddowsToLsk = (amount: BigInt | string) =>
  transactions.convertBeddowsToLSK(typeof amount === 'string' ? amount : amount.toString());

export const displayDate = (isoDate: string) =>
  DateTime.fromISO(isoDate).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);

export const displayDateTime = (isoDate: string) =>
  DateTime.fromISO(isoDate).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY);
