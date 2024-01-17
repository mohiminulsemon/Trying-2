import React, { useState } from 'react';

function CanvasFontFamilySelect() {
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
    <div className="w-full">
      <div
        className={
          (isFocus ? 'ring-indigo-400 ring-[1px]' : 'hover:ring-[1px] ring-zinc-400') +
          ' w-full p-1 flex justify-between rounded-sm items-center'
        }
      >
        font select
        <div className="w-[20px]">
          <i className="fa-solid fa-chevron-down text-xs"></i>
        </div>
      </div>
    </div>
  );
}

export default CanvasFontFamilySelect;
