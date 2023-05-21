
import { base64StringToBlob } from 'blob-util';
import { saveAs } from 'file-saver'

export function useMapsSaver<T extends Record<string, any>>(filename: string) {
  return [
    (data: T) => {
      Object.entries(data).map(async ([name, map]) => {
        const src = map.replace('data:image/png;base64,', '');
        const blob = base64StringToBlob(src, 'image/png');

        saveAs(blob, filename.replace('[name]', name));
      });
    }
  ]
}
