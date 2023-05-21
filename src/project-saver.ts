
import { saveAs } from 'file-saver'

export function useProjectSaver<T>(name: string) {
  return [
    (data: T) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json;charset=utf-8'
      });

      saveAs(blob, name);
    }
  ]
}
