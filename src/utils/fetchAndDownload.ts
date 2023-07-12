import { downloadURL } from './downloadURL';

export function fetchAndDownload(url: string, fileName: string) {
  fetch(url, {
    method: 'GET',
  })
    .then((resp) => resp.blob())
    .then((blob) => {
      downloadURL(window.URL.createObjectURL(blob), fileName);
    });
}
