import React, { useState } from 'react';
import ClickAwayListener from 'react-click-away-listener';

function CanvasPropertiesTextInput({ label = 'label', value = '', onChange = () => {} }) {
  // ------------------------------------------------------------------------------
  // variables
  // ------------------------------------------------------------------------------
  const [isFocus, setIsFocus] = useState(false);

  // ------------------------------------------------------------------------------
  // functions
  // ------------------------------------------------------------------------------

  // ------------------------------------------------------------------------------
  // render
  // ------------------------------------------------------------------------------
  return (
    <ClickAwayListener onClickAway={() => setIsFocus(false)}>
      <div
        onClick={() => setIsFocus(true)}
        className={
          (isFocus ? 'ring-indigo-400 ring-[1px] ' : 'hover:ring-[1px] ring-zinc-400 ') +
          'w-full h-[28px] rounded-sm flex px-1  items-center space-x-2 text-xs'
        }
      >
        {/* label */}
        <div className="w-[20%] truncate">{label}</div>

        {/* input */}

        <div className="w-[80%]">
          <input
            onChange={(e) => onChange(e.target.value)}
            value={value}
            className="w-full bg-transparent  outline-none  cursor-default"
            type="text"
          />
        </div>
      </div>
    </ClickAwayListener>
  );
}

export default CanvasPropertiesTextInput;
