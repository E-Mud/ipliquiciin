import { FunctionalComponent, h } from 'preact';

import style from './app.css';
import { useAutosize } from '../hooks/use-autosize';
import { Ref, useRef, useState } from 'preact/hooks';
import { TargetedEvent } from 'preact/compat';

const VOWEL_MAP: Record<string, string> = {
  'a': 'i',
  'e': 'i',
  'o': 'i',
  'á': 'í',
  'é': 'í',
  'ó': 'í',
  'A': 'I',
  'E': 'I',
  'O': 'I',
  'U': 'I',
  'Á': 'Í',
  'É': 'Í',
  'Ó': 'Í',
  'Ú': 'Í',
};

function useTextarea(): [
  Ref<HTMLTextAreaElement>,
  string,
  (v: string) => void
] {
  const [value, setValue] = useState<string>('');
  const ref = useRef<HTMLTextAreaElement>(null);
  useAutosize(ref, value);

  return [
    ref,
    value,
    setValue
  ];
}

function isUpperCase(val: string) {
  return val === val.toUpperCase();
}

function replace(input: string) {
  return input
    .replace(/([^qQgG]|^)([uú])/g, function(_, firstLetter: string, vowel: string) {
      return (firstLetter || '') + VOWEL_MAP[vowel];
    })
    //
    .replace(/ü[ei]/g, 'ui')
    //
    .replace(/([gG])[ao]/g, '$1ui')
    .replace(/([gG])u[^ei]/g, '$1ui')
    //
    .replace(/([zZ])([aouáóú])/g, (_, firstLetter: string, vowel: string) => {
      return (isUpperCase(firstLetter) ? 'C' : 'c') + VOWEL_MAP[vowel];
    })
    //
    .replace(/([cC])([aouáóú])/g, (_, firstLetter: string, vowel: string) => {
      return (isUpperCase(firstLetter) ? 'Qu' : 'qu') + VOWEL_MAP[vowel];
    })
    //
    .replace(/[aeoáéóAEOUÁÉÓÚ]/g, (vowel: string) => {
      return VOWEL_MAP[vowel];
    });
}

const App: FunctionalComponent = () => {
  const [inputRef, inputValue, setInputValue] = useTextarea();
  const [outputRef, outputValue, setOutputValue] = useTextarea();

  function handleInput(event: TargetedEvent<HTMLTextAreaElement, Event>) {
    const newValue = event.currentTarget.value;
    const replaced = replace(newValue);

    setInputValue(newValue);
    setOutputValue(replaced);
    navigator.clipboard.writeText(replaced);
  }

  return (
    <div id="preact_root">
      <div class={style.home}>
        <textarea rows={1} value={inputValue} onInput={handleInput} ref={inputRef} name="val" placeholder="Escribe aquí" autoFocus />
        <textarea rows={1} value={outputValue} onInput={handleInput} ref={outputRef} name="val" placeholder="Iscribi iqui" disabled />
      </div>
    </div>
  );
};

export default App;
