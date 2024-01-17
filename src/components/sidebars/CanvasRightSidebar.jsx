import React, { useCallback, useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { useDispatch, useSelector } from 'react-redux';
import { updateRightSidebar } from '../../features/canvasSlice';
import { CanvasPropertiesModal, CanvasTextPropertiesModal } from '..';
import { canvasElementType } from '../../utils/constants';

function CanvasRightSidebar() {
  // ------------------------------------------------------------------------------
  // variables
  // ------------------------------------------------------------------------------
  const minWidth = 300;

  const dispatch = useDispatch();

  const isDarkMode = useSelector((state) => state.persist.appReducer.isDarkMode);
  const rightSidebar = useSelector((state) => state.persist.canvasReducer.rightSidebar);
  const mouse = useSelector((state) => state.persist.appReducer.mouse);
  const screen = useSelector((state) => state.persist.appReducer.screen);
  const selectedElementID = useSelector((state) => state.persist.canvasReducer.selectedElementID);
  const selectedCanvas = useSelector((state) => state.persist.canvasReducer.selectedCanvas);

  const [isResizeAreaHover, setIsResizeAreaHover] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);

  // ------------------------------------------------------------------------------
  // functions
  // ------------------------------------------------------------------------------
  const handleBeforeResize = () => {
    const updatedRightSidebar = {
      ...rightSidebar,
      resizing: true
    };

    dispatch(updateRightSidebar(updatedRightSidebar));
  };

  const handleAfterResize = () => {
    const updatedRightSidebar = {
      ...rightSidebar,
      resizing: false
    };

    dispatch(updateRightSidebar(updatedRightSidebar));
  };

  const handleResize = useCallback((event) => {
    event.preventDefault();
    const newWidth = screen.x - mouse.x;

    if (newWidth > minWidth && newWidth < screen.x / 3) {
      const updatedRightSidebar = {
        ...rightSidebar,
        width: newWidth
      };
      dispatch(updateRightSidebar(updatedRightSidebar));
    }
  });

  const handleOpen = () => {
    const updatedRightSidebar = {
      ...rightSidebar,
      open: !rightSidebar.open
    };
    dispatch(updateRightSidebar(updatedRightSidebar));
  };

  useEffect(() => {
    if (selectedElementID !== -1 && selectedCanvas !== null) {
      // console.log('update selected element');
      const result = selectedCanvas.elements?.find((element) => {
        if (element.id === selectedElementID) {
          return element;
        }
      });

      setSelectedElement(result);
    } else {
      setSelectedElement(null);
    }
  }, [selectedCanvas]);
  // ------------------------------------------------------------------------------
  // render
  // ------------------------------------------------------------------------------
  return (
    <div
      style={{
        width: rightSidebar.open ? rightSidebar.width + 'px' : '1px',
        left: rightSidebar.open ? screen.x - rightSidebar.width + 'px' : screen.x - 1 + 'px'
      }}
      className={
        (rightSidebar.resizing ? '' : 'ease-in-out duration-300 ') +
        'relative top-0  h-full bg-zinc-200 dark:bg-zinc-800 '
      }
    >
      {/* resize boder */}
      <div
        style={{
          width: rightSidebar.open ? '3px' : '0px',
          left: rightSidebar.open ? '0px' : '-3px'
        }}
        className={
          (isResizeAreaHover || rightSidebar.resizing ? 'animate-fade-in ' : 'animate-fade-out ') +
          (rightSidebar.resizing ? 'bg-green-400 ' : 'bg-indigo-400 ') +
          (rightSidebar.open ? 'ease-in-out duration-500 ' : '') +
          ' h-full absolute '
        }
      ></div>

      {/* resize area */}
      <Draggable
        onStart={handleBeforeResize}
        onStop={handleAfterResize}
        onDrag={handleResize}
        bounds="parent"
        position={{ x: -5, y: 0 }}
      >
        <div
          style={{
            width: rightSidebar.open ? '15px' : '0px'
          }}
          onMouseEnter={() => setIsResizeAreaHover(true)}
          onMouseLeave={() => setIsResizeAreaHover(false)}
          className={
            (rightSidebar.open ? 'ease-in-out duration-500 ' : '') + ' z-20 h-full cursor-w-resize'
          }
        ></div>
      </Draggable>

      {/* toggle button */}
      <div
        onClick={() => handleOpen()}
        className="w-[20px] h-[60px] absolute -left-[20px] top-[40%] z-20
       cursor-pointer bg-inherit hover:bg-indigo-400  text-zinc-700 dark:text-zinc-400 hover:text-white"
      >
        <div className="w-full h-full relative">
          <svg viewBox="0 0 20 60">
            <path
              fill={isDarkMode ? '#3f3f46' : '#ecfeff'}
              d="M 20 60 Z L 0 60 L -0 0 L 20 0 Q 20 6 12 7 Q 5 7 3 14 L 3 46 Q 5 53 12 53 Q 20 54 20 60"
            ></path>
          </svg>

          <div className="text-[10px] absolute top-[23px] left-2">
            <i
              className={
                (rightSidebar.open ? 'rotate-180' : 'rotate-0') +
                ' fa-solid fa-chevron-left origin-center ease-in-out duration-200'
              }
            ></i>
          </div>
        </div>
      </div>

      {/* canvas element properties modals */}
      <div className="absolute top-0 left-2 w-[calc(100%-8px)] h-full ps-1">
        {selectedElementID == -1 ? (
          <CanvasPropertiesModal />
        ) : (
          (selectedElement?.type == canvasElementType.text ||
            selectedElement?.type == canvasElementType.textV2) && (
            <CanvasTextPropertiesModal element={selectedElement} />
          )
        )}
      </div>
    </div>
  );
}

export default CanvasRightSidebar;
