import { useMemo } from 'react';
import { useFilePicker } from 'use-file-picker';

export function useProjectPicker() {
  const [openFileSelector, { filesContent }] = useFilePicker({
    accept: '.json',
  });
  const file = useMemo(() => {
    const file = filesContent[0]
    if (!file) return

    return JSON.parse(file.content)
  }, [filesContent])


  return [openFileSelector, file]
}
