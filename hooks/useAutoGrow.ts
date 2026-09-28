import { useCallback, useLayoutEffect, useRef } from 'react';

/**
 * Faz o textarea crescer junto com o conteúdo, para que texto grande
 * seja lido inteiro sem scroll interno.
 */
export function useAutoGrow() {
  const ref = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useLayoutEffect(resize);

  return { ref, resize };
}
