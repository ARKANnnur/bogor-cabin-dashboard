import { useEffect, useRef } from 'react';

function useOutsideClick(handle, listCapturing = true) {
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        handle();
      }
    }

    document.addEventListener('click', handleClick, listCapturing);

    return () =>
      document.removeEventListener('click', handleClick, listCapturing);
  }, [handle, listCapturing]);

  return ref;
}

export default useOutsideClick;
