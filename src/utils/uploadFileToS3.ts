export function uploadFileToS3(presignedUrl: string, file: string | ArrayBuffer, contentType: string) {
  return fetch(presignedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
    },
    body: file,
  });
}
