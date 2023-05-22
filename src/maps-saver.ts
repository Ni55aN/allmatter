import { saveAs } from 'file-saver'

export function useMapsSaver<T extends Record<string, HTMLCanvasElement>>(filename: string) {
  return [
    (data: T) => {
      Object.entries(data).map(async ([name, map]) => {
        saveAs(map.toDataURL('image/png'), filename.replace('[name]', name));
      });
    }
  ]
}
