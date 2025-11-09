
import JSZip from 'jszip';

/**
 * Converts a File object into an HTMLImageElement.
 */
export function fileToImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image: ${file.name}`));
    };
    img.src = url;
  });
}

/**
 * Unzips a .zip file and returns an array of File objects for the images inside.
 */
export async function unzipImages(zipFile: File): Promise<File[]> {
  const zip = await JSZip.loadAsync(zipFile);
  const imagePromises: Promise<File>[] = [];
  const validExtensions = /\.(jpe?g|png|webp|gif)$/i;

  zip.forEach((relativePath, zipEntry) => {
    if (!zipEntry.dir && validExtensions.test(zipEntry.name)) {
      const promise = zipEntry.async('blob').then(blob => {
        // Use a more specific MIME type if available from the extension
        let type = 'application/octet-stream';
        const extension = zipEntry.name.split('.').pop()?.toLowerCase();
        if (extension === 'jpg' || extension === 'jpeg') type = 'image/jpeg';
        else if (extension === 'png') type = 'image/png';
        else if (extension === 'webp') type = 'image/webp';
        else if (extension === 'gif') type = 'image/gif';
        
        return new File([blob], zipEntry.name, { type });
      });
      imagePromises.push(promise);
    }
  });

  return Promise.all(imagePromises);
}
