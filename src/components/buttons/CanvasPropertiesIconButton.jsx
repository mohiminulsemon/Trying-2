import React from 'react';

function CanvasPropertiesIconButton({ icon = 'icon', selected = false, onClick = () => {} }) {
  // ------------------------------------------------------------------------------
  // variables
  // ------------------------------------------------------------------------------

  // ------------------------------------------------------------------------------
  // functions
  // ------------------------------------------------------------------------------

  // ------------------------------------------------------------------------------
  // render
  // ------------------------------------------------------------------------------
  return (
    <div
      onClick={onClick}
      className={
        (selected ? 'ring-indigo-400 ring-[1px] ' : 'hover:ring-[1px] ring-zinc-400 ') +
        'h-[28px] w-[28px] flex justify-center items-center ' +
        'rounded-sm '
      }
    >
      {icon}
    </div>
  );
}

export default CanvasPropertiesIconButton;
