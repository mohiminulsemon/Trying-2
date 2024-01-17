import React, { useState } from 'react';

function CanvasPropertiesTextareaInput({ value = '', onChange = () => {} }) {
  // ------------------------------------------------------------------------------
  // variables
  // ------------------------------------------------------------------------------
  const [isFocus, setIsFocus] = useState(false);
  const [composing, setComposing] = useState(false);

  // ------------------------------------------------------------------------------
  // functions
  // ------------------------------------------------------------------------------
  const handleChange = (value) => {
    console.log('composing :>> ', composing);
    if (composing) {
    } else {
    }
    onChange(value);
  };

  const handleSubmit = (value) => {
    console.log('value :>> ', value);
  };
  // ------------------------------------------------------------------------------
  // render
  // ------------------------------------------------------------------------------
  return (
    <div>
      <textarea
        value={value}
        onCompositionStart={(e) => setComposing(false)}
        onCompositionEnd={(e) => setComposing(true)}
        onSubmit={(e) => handleSubmit(e.target.value)}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={(e) => setIsFocus(true)}
        onBlur={(e) => setIsFocus(false)}
        className={
          (isFocus ? 'ring-indigo-400 ring-[1px]' : 'hover:ring-[1px] ring-zinc-400') +
          ' w-full h-[200px] resize-none outline-none ' +
          'p-1 bg-zinc-100 dark:bg-zinc-600 rounded-sm'
        }
      ></textarea>
    </div>
  );
}

export default CanvasPropertiesTextareaInput;
