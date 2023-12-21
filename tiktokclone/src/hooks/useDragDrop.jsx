import { useEffect, useRef, useCallback } from 'react';

export default function useDragDrop(onDrop) {
  const dropRef = useRef();
  const inputRef = useRef();

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        console.log(file);
        onDrop(file);
        e.dataTransfer.clearData();
      }
    },
    [onDrop]
  );

  useEffect(() => {
    const dropArea = dropRef.current;
    dropArea.addEventListener('dragover', handleDrag);
    dropArea.addEventListener('drop', handleDrop);

    return () => {
      dropArea.removeEventListener('dragover', handleDrag);
      dropArea.removeEventListener('drop', handleDrop);
    };
  }, [handleDrag, handleDrop]);

  const selectFile = useCallback(() => {
    inputRef.current.click();
  }, []);

  const onSelectFile = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) {
        onDrop(file);
      }
    },
    [onDrop]
  );

  return { dropRef, inputRef, selectFile, onSelectFile };
}
