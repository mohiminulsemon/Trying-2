import React, { useRef, useState, useCallback, useEffect } from 'react';
import ClickAwayListener from 'react-click-away-listener';
import Draggable from 'react-draggable';
import { useSelector } from 'react-redux';
import { diffPoints } from '../../utils/canvas';

function CanvasPropertiesNumberInput({
  label = 'label',
  specialLabel,
  value = 0,
  onChange = () => {},
  textAlign = '',
  min
}) {
  // ------------------------------------------------------------------------------
  // variables
  // ------------------------------------------------------------------------------
  const mouse = useSelector((state) => state.persist.appReducer.mouse);

  const [isFocus, setIsFocus] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const inputRef = useRef(null);
  // ------------------------------------------------------------------------------
  // functions
  // ------------------------------------------------------------------------------
  const handleMouseMove = useCallback((event) => {
    lastMousePosRef.current = mouse;
    // console.log('lastMousePosRef :>> ', lastMousePosRef);
  });

  const handleDrag = useCallback(
    (event) => {
      const lastMousePos = lastMousePosRef.current;
      const currentMousePos = mouse;
      lastMousePosRef.current = currentMousePos;
      let mouseDiff = diffPoints(currentMousePos, lastMousePos);

      if (mouseDiff.x > 0) {
        onChange(parseInt(value) + 1);
        setInputValue(parseInt(value) + 1);
      } else {
        let newValue = parseInt(value) - 1;
        if (min) {
          newValue = newValue < min ? min : newValue;
        }
        onChange(newValue);
        setInputValue(newValue);
      }
    },
    [mouse]
  );

  const handleBetweenDrag = (value) => {
    setIsDragging(value);
    setIsFocus(false);
  };

  const handleEnterKeyDown = (event) => {
    if (event.key == 'Enter') {
      setIsFocus(false);
      onChange(parseInt(inputValue));
      inputRef.current.blur();
    }
  };

  const handleInputBlur = () => {
    onChange(parseInt(inputValue));
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // ------------------------------------------------------------------------------
  // render
  // ------------------------------------------------------------------------------
  return (
    <ClickAwayListener onClickAway={() => setIsFocus(false)}>
      <div
        onMouseMove={handleMouseMove}
        className={
          (isDragging ? 'ring-green-400 ring-[1px] ' : ' ') +
          (isFocus && !isDragging ? 'ring-indigo-400 ring-[1px] ' : '') +
          (!isFocus && !isDragging && 'hover:ring-[1px] ring-zinc-400') +
          ' w-full h-[28px]  rounded-sm flex px-1 text-xs '
        }
      >
        {/* label */}
        <div className="w-[40%] h-full flex items-center cursor-e-resize prevent-select relative truncate ">
          {specialLabel ? (
            <span className="text-[18px] ms-[-2px]">{specialLabel}</span>
          ) : (
            <span>{label}</span>
          )}

          <Draggable
            onStart={() => handleBetweenDrag(true)}
            onStop={() => handleBetweenDrag(false)}
            onDrag={handleDrag}
            bounds="parent"
          >
            <div className="w-full h-full absolute top-0 left-0"></div>
          </Draggable>
        </div>

        {/* input */}
        <div onClick={() => setIsFocus(true)} className="w-[60%] h-full flex items-center px-2 ">
          <input
            ref={inputRef}
            onKeyDown={(e) => handleEnterKeyDown(e)}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleInputBlur}
            value={inputValue}
            className={'w-full outline-none  cursor-default bg-transparent ' + textAlign}
            type="number"
          />
        </div>
      </div>
    </ClickAwayListener>
  );
}

export default CanvasPropertiesNumberInput;
