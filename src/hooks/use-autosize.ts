import { Ref, useLayoutEffect } from "preact/hooks";
import { useSize } from "./use-size";

const BORDER_HEIGHT = 2;

function autosize(element: HTMLTextAreaElement) {
  element.style.height = 'auto';

  const newHeight = element.scrollHeight + BORDER_HEIGHT;
  element.style.height = `${newHeight}px`;
}

export function useAutosize(ref: Ref<HTMLTextAreaElement>, value: string | undefined) {
  const elemSize = useSize(ref);

  useLayoutEffect(
    () => {
      if (ref.current) {
        autosize(ref.current);
      }
    },
    [
      ref.current,
      value,
      elemSize ? elemSize.width : undefined
    ]
  );

  return ref;
}
