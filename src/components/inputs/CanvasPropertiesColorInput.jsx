import React, { useState, useEffect } from 'react';
import { Sketch } from '@uiw/react-color';
import ClickAwayListener from 'react-click-away-listener';
import { useSelector } from 'react-redux';

function CanvasPropertiesColorInput({ label = 'label', color = '#fff', onChange = () => {} }) {
  // ------------------------------------------------------------------------------
  // variables
  // ------------------------------------------------------------------------------
  const isDarkMode = useSelector((state) => state.persist.appReducer.isDarkMode);

  const [open, setOpen] = useState(false);
  const [squareColor, setSquareColor] = useState(color);

  // ------------------------------------------------------------------------------
  // functions
  // ------------------------------------------------------------------------------
  const handleColorChange = (hex) => {
    onChange(hex);
    setSquareColor(hex);
  };

  useEffect(() => {
    setSquareColor(color);
  }, [color]);
  // ------------------------------------------------------------------------------
  // render
  // ------------------------------------------------------------------------------
  return (
    <div className="w-full h-[28px] rounded-sm px-1 relative">
      <div className="flex items-center justify-between w-full mb-2 text-xs">
        {/* label */}
        <div className="truncate">{label}</div>

        {/* color square */}
        <div
          onClick={() => setOpen(!open)}
          style={{ backgroundColor: squareColor }}
          className="w-[20px] h-[20px]  border border-zinc-600 dark:border-zinc-200 cursor-pointer"
        ></div>
      </div>

      {/* color picker */}
      {open && (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <div className="absolute top-[30px] right-0 animate-fade-in z-20 ">
            <Sketch
              style={{ marginLeft: 20, '--sketch-background': isDarkMode ? '#323232' : '#fff' }}
              color={color}
              onChange={(color) => {
                handleColorChange(color.hex);
              }}
            />
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
}

export default CanvasPropertiesColorInput;
