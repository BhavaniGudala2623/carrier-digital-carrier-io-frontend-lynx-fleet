import { downloadURL } from './downloadURL';

export const downloadStringAsFile = (input, fileName) => {
  const encoded = encodeURI(input);
  downloadURL(encoded, fileName);
};
