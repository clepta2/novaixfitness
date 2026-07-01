import { useRef, useEffect, MutableRefObject } from 'react';

export function useMountedRef(): MutableRefObject<boolean> {
  const mounted = useRef<boolean>(true);

  useEffect(() => {
    return () => { mounted.current = false; };
  }, []);

  return mounted;
}
