import { downloadURL } from './downloadURL';

export const downloadBlob = (data, fileName) => {
  const url = URL.createObjectURL(data);
  downloadURL(url, fileName);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
