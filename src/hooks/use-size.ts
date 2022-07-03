import { RefObject } from "preact";
import { useEffect, useState } from "preact/hooks";

export interface Size {
  width: number;
  height: number;
}

export function useSize(ref: RefObject<HTMLElement>): Size | undefined {
  const [size, setSize] = useState<Size>();

  useEffect(
    () => {
      if (ref.current && window.ResizeObserver) {
        const observer = new ResizeObserver(
          (entries: ResizeObserverEntry[]) => {
            const [{ contentRect }] = entries;
            setSize({ width: contentRect.width, height: contentRect.height });
          }
        );
        observer.observe(ref.current);

        return () => observer.disconnect();
      }
    },
    [ref]
  );

  return size;
}