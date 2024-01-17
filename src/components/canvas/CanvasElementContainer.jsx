import React, { useState, useEffect, useCallback, useRef } from 'react';
import { diffPoints, scalePoint } from '../../utils/canvas';
import { useSelector, useDispatch } from 'react-redux';
import Draggable from 'react-draggable';
import { setAllElementSelected, updateCanvasElement } from '../../features/canvasSlice';
import ClickAwayListener from 'react-click-away-listener';
import { updateIsDragging } from '../../features/appSlice';

function CanvasElementContainer({ children, element }) {
  // ------------------------------------------------------------------------------
  // variables
  // ------------------------------------------------------------------------------
  const resizeMode = {
    topLeft: 0,
    topRight: 1,
    bottomLeft: 2,
    bottomRight: 3,
    top: 4,
    bottom: 5,
    left: 6,
    right: 7
  };

  const circleRadius = 10.0;

  const dispatch = useDispatch();

  const mouse = useSelector((state) => state.persist.appReducer.mouse);
  const isSpaceKeyHeld = useSelector((state) => state.persist.canvasReducer.isSpaceKeyHeld);
  const scale = useSelector((state) => state.persist.canvasReducer.selectedCanvas.scale);

  const selectedElementID = useSelector((state) => state.persist.canvasReducer.selectedElementID);
  const selectedCanvas = useSelector((state) => state.persist.canvasReducer.selectedCanvas);

  const [anchorCircleSize, setAnchorCircleSize] = useState(circleRadius / scale);
  const [elementWidth, setElementWidth] = useState(element.width);
  const [elementHeight, setElementHeight] = useState(element.height);
  const [elementTop, setElementTop] = useState(element.top);
  const [elementLeft, setElementLeft] = useState(element.left);
  const [elementBottom, setElementBottom] = useState(element.top + element.height);
  const [elementRight, setElementRight] = useState(element.left + element.width);

  const lastMousePosRef = useRef({ x: 0, y: 0 });
  // ------------------------------------------------------------------------------
  // functions
  // ------------------------------------------------------------------------------
  const addLineComponent = () => {
    dispatch(
      addShapeComponent(canvasElementType.LINE, {
        points: [
          { x: 0, y: 0 },
          { x: 100, y: 100 }
        ]
      })
    );
  };

  const addSquareComponent = () => {
    dispatch(
      addShapeComponent(canvasElementType.SQUARE, {
        /* add properties as needed */
      })
    );
  };

  const handleMouseMove = useCallback((event) => {
    lastMousePosRef.current = mouse;
  });

  const handleElementMove = useCallback(
    (event, dragElement) => {
      event.preventDefault();
      console.log('dragElement :>> ', dragElement);
      if (isSpaceKeyHeld) return;

      const lastMousePos = lastMousePosRef.current;
      const currentMousePos = mouse;
      lastMousePosRef.current = currentMousePos;
      let mouseDiff = diffPoints(currentMousePos, lastMousePos);
      mouseDiff = scalePoint(mouseDiff, scale);

      setElementTop(elementTop + mouseDiff.y);
      setElementBottom(elementBottom + mouseDiff.y);
      setElementLeft(elementLeft + mouseDiff.x);
      setElementRight(elementRight + mouseDiff.x);

      let updatedElement = {
        ...element
      };
      updatedElement.top = elementTop + mouseDiff.y;
      updatedElement.left = elementLeft + mouseDiff.x;

      dispatch(updateCanvasElement(updatedElement));
    },
    [
      isSpaceKeyHeld,
      mouse,
      elementHeight,
      elementWidth,
      elementTop,
      elementLeft,
      elementRight,
      elementBottom
    ]
  );

  const handleElementResize = useCallback(
    (event, mode) => {
      event.preventDefault();
      if (isSpaceKeyHeld) return;

      const lastMousePos = lastMousePosRef.current;
      const currentMousePos = mouse;
      lastMousePosRef.current = currentMousePos;
      let mouseDiff = diffPoints(currentMousePos, lastMousePos);
      mouseDiff = scalePoint(mouseDiff, scale);

      const minWidth = 100;
      const minHeight = 100;
      let newWidth, newHeight, newTop, newLeft, newRight, newBottom;
      let maxTop, maxLeft, minBottom, minRight;

      // top left resize
      if (mode == resizeMode.topLeft) {
        newWidth = elementWidth - mouseDiff.x;
        newWidth = newWidth < minWidth ? minWidth : newWidth;
        setElementWidth(newWidth);

        newHeight = elementHeight - mouseDiff.y;
        newHeight = newHeight < minHeight ? minHeight : newHeight;
        setElementHeight(newHeight);

        newTop = elementTop + mouseDiff.y;
        maxTop = elementBottom - newHeight;
        setElementTop(newTop > maxTop ? maxTop : newTop);

        newLeft = newLeft = elementLeft + mouseDiff.x;
        maxLeft = elementRight - newWidth;
        setElementLeft(newLeft > maxLeft ? maxLeft : newLeft);

        let updatedElement = {
          ...element
        };
        updatedElement.top = newTop > maxTop ? maxTop : newTop;
        updatedElement.left = newLeft > maxLeft ? maxLeft : newLeft;
        updatedElement.width = newWidth;
        updatedElement.height = newHeight;

        dispatch(updateCanvasElement(updatedElement));
      }
      // top right resize
      else if (mode == resizeMode.topRight) {
        newWidth = elementWidth + mouseDiff.x;
        newWidth = newWidth < minWidth ? minWidth : newWidth;
        setElementWidth(newWidth);

        newHeight = elementHeight - mouseDiff.y;
        newHeight = newHeight < minHeight ? minHeight : newHeight;
        setElementHeight(newHeight);

        newTop = elementTop + mouseDiff.y;
        maxTop = elementBottom - newHeight;
        setElementTop(newTop > maxTop ? maxTop : newTop);

        newRight = elementRight + mouseDiff.x;
        minRight = elementLeft + newWidth;
        setElementRight(newRight < minRight ? minRight : newRight);

        let updatedElement = {
          ...element
        };
        updatedElement.top = newTop > maxTop ? maxTop : newTop;
        updatedElement.width = newWidth;
        updatedElement.height = newHeight;

        dispatch(updateCanvasElement(updatedElement));
      }
      // bottom left resize
      else if (mode == resizeMode.bottomLeft) {
        newWidth = elementWidth - mouseDiff.x;
        newWidth = newWidth < minWidth ? minWidth : newWidth;
        setElementWidth(newWidth);

        newHeight = elementHeight + mouseDiff.y;
        newHeight = newHeight < minHeight ? minHeight : newHeight;
        setElementHeight(newHeight);

        newBottom = elementBottom + mouseDiff.y;
        minBottom = elementTop + newHeight;
        setElementBottom(newBottom < minBottom ? minBottom : newBottom);

        newLeft = elementLeft + mouseDiff.x;
        maxLeft = elementRight - newWidth;
        setElementLeft(newLeft > maxLeft ? maxLeft : newLeft);

        let updatedElement = {
          ...element
        };
        updatedElement.left = newLeft > maxLeft ? maxLeft : newLeft;
        updatedElement.width = newWidth;
        updatedElement.height = newHeight;

        dispatch(updateCanvasElement(updatedElement));
      }
      // bottom right resize
      else if (mode == resizeMode.bottomRight) {
        newWidth = elementWidth + mouseDiff.x;
        newWidth = newWidth < minWidth ? minWidth : newWidth;
        setElementWidth(newWidth);

        newHeight = elementHeight + mouseDiff.y;
        newHeight = newHeight < minHeight ? minHeight : newHeight;
        setElementHeight(newHeight);

        newBottom = elementBottom + mouseDiff.y;
        minBottom = elementTop + newHeight;
        setElementBottom(newBottom < minBottom ? minBottom : newBottom);

        newRight = elementRight + mouseDiff.x;
        minRight = elementLeft + newWidth;
        setElementRight(newRight < minRight ? minRight : newRight);

        let updatedElement = {
          ...element
        };
        updatedElement.width = newWidth;
        updatedElement.height = newHeight;

        dispatch(updateCanvasElement(updatedElement));
      }
      // top resize
      else if (mode == resizeMode.top) {
        newHeight = elementHeight - mouseDiff.y;
        newHeight = newHeight < minHeight ? minHeight : newHeight;
        setElementHeight(newHeight);

        newTop = elementTop + mouseDiff.y;
        maxTop = elementBottom - newHeight;
        setElementTop(newTop > maxTop ? maxTop : newTop);

        let updatedElement = {
          ...element
        };
        updatedElement.height = newHeight;
        updatedElement.top = newTop > maxTop ? maxTop : newTop;

        dispatch(updateCanvasElement(updatedElement));
      }
      // bottom resize
      else if (mode == resizeMode.bottom) {
        newHeight = elementHeight + mouseDiff.y;
        newHeight = newHeight < minHeight ? minHeight : newHeight;
        setElementHeight(newHeight);

        newBottom = elementBottom + mouseDiff.y;
        minBottom = elementTop + newHeight;
        setElementBottom(newBottom < minBottom ? minBottom : newBottom);

        let updatedElement = {
          ...element
        };
        updatedElement.height = newHeight;

        dispatch(updateCanvasElement(updatedElement));
      }
      // left resize
      else if (mode == resizeMode.left) {
        newWidth = elementWidth - mouseDiff.x;
        newWidth = newWidth < minWidth ? minWidth : newWidth;
        setElementWidth(newWidth);

        newLeft = newLeft = elementLeft + mouseDiff.x;
        maxLeft = elementRight - newWidth;
        setElementLeft(newLeft > maxLeft ? maxLeft : newLeft);

        let updatedElement = {
          ...element
        };
        updatedElement.width = newWidth;
        updatedElement.left = newLeft > maxLeft ? maxLeft : newLeft;

        dispatch(updateCanvasElement(updatedElement));
      }
      // right resize
      else if (mode == resizeMode.right) {
        newWidth = elementWidth + mouseDiff.x;
        newWidth = newWidth < minWidth ? minWidth : newWidth;
        setElementWidth(newWidth);

        newRight = elementRight + mouseDiff.x;
        minRight = elementLeft + newWidth;
        setElementRight(newRight < minRight ? minRight : newRight);

        let updatedElement = {
          ...element
        };
        updatedElement.width = newWidth;

        dispatch(updateCanvasElement(updatedElement));
      }
    },
    [
      isSpaceKeyHeld,
      mouse,
      elementWidth,
      elementHeight,
      elementTop,
      elementLeft,
      elementRight,
      elementBottom
    ]
  );

  const handleDragStart = () => {
    // console.log('drag start');
    dispatch(updateIsDragging(true));
  };

  const handleDragEnd = () => {
    // console.log('drag end');
    setTimeout(() => dispatch(updateIsDragging(false)), 0);
  };

  const handleRotate = () => {};

  const handleDbClick = (event) => {
    console.log('db click');
  };

  useEffect(() => {
    setAnchorCircleSize(circleRadius / scale);
  }, [scale]);

  useEffect(() => {
    if (selectedElementID == element.id) {
      if (selectedElementID !== -1 && selectedCanvas !== null) {
        const result = selectedCanvas.elements.find((e) => {
          if (e.id === selectedElementID) {
            return e;
          }
        });

        setElementWidth(result.width);
        setElementHeight(result.height);
        setElementTop(result.top);
        setElementLeft(result.left);
        setElementRight(result.left + result.width);
        setElementBottom(result.top + result.height);
      }
    }
  }, [selectedCanvas]);
  // ------------------------------------------------------------------------------
  // render
  // ------------------------------------------------------------------------------
  if (!element.selected || isSpaceKeyHeld) {
    return (
      <div
        style={{
          top: elementTop + 'px',
          left: elementLeft + 'px',
          width: elementWidth + 'px',
          height: elementHeight + 'px'
        }}
        className="absolute"
      >
        {children}
      </div>
    );
  }

  return (
    <div
      onMouseMove={(e) => handleMouseMove(e)}
      onDoubleClick={(e) => handleDbClick(e)}
      style={{ top: elementTop + 'px', left: elementLeft + 'px' }}
      className="absolute"
    >
      <div className="w-full h-full absolute top-0 left-0">{children}</div>

      <div
        style={{
          width: elementWidth + 'px',
          height: elementHeight + 'px',
          borderWidth: 3.0 / scale + 'px',
          transform: 'rotate(' + (element?.rotate ?? 0) + 'deg)'
        }}
        className=" border-indigo-400/50 relative "
      >
        {/* drag move area */}
        <div className="cursor-pointer absolute w-full h-full ">
          <Draggable
            onStart={handleDragStart}
            onStop={handleDragEnd}
            onDrag={handleElementMove}
            scale={scale}
            bounds="parent"
          >
            <div className="w-full h-full bg-red-300 "></div>
          </Draggable>
        </div>

        {/* top drag area */}
        <div
          style={{
            height: 14 / scale + 'px',
            top: -7 / scale + 'px'
          }}
          className=" absolute w-full cursor-n-resize "
        >
          <Draggable
            onStart={handleDragStart}
            onStop={handleDragEnd}
            onDrag={(e) => handleElementResize(e, resizeMode.top)}
            bounds="parent"
          >
            <div className="w-full h-full "></div>
          </Draggable>
        </div>

        {/* bottom drag area */}
        <div
          style={{
            height: 14 / scale + 'px',
            bottom: -7 / scale + 'px'
          }}
          className=" absolute w-full cursor-s-resize"
        >
          <Draggable
            onStart={handleDragStart}
            onStop={handleDragEnd}
            onDrag={(e) => handleElementResize(e, resizeMode.bottom)}
            bounds="parent"
          >
            <div className="w-full h-full "></div>
          </Draggable>
        </div>

        {/* left drag area */}
        <div
          style={{
            width: 14 / scale + 'px',
            left: -7 / scale + 'px'
          }}
          className=" absolute h-full cursor-w-resize"
        >
          <Draggable
            onStart={handleDragStart}
            onStop={handleDragEnd}
            onDrag={(e) => handleElementResize(e, resizeMode.left)}
            bounds="parent"
          >
            <div className="w-full h-full "></div>
          </Draggable>
        </div>

        {/* right drag area */}
        <div
          style={{
            width: 14 / scale + 'px',
            right: -7 / scale + 'px'
          }}
          className="  absolute h-full cursor-e-resize"
        >
          <Draggable
            onStart={handleDragStart}
            onStop={handleDragEnd}
            onDrag={(e) => handleElementResize(e, resizeMode.right)}
            bounds="parent"
          >
            <div className="w-full h-full "></div>
          </Draggable>
        </div>

        {/* top left circle anchor */}
        <div
          style={{
            width: anchorCircleSize + 'px',
            height: anchorCircleSize + 'px',
            top: anchorCircleSize / -2 + 'px',
            left: anchorCircleSize / -2 + 'px',
            borderWidth: 2.0 / scale + 'px'
          }}
          className=" rounded-full border-indigo-400 bg-white absolute cursor-nw-resize"
        >
          <Draggable
            onStart={handleDragStart}
            onStop={handleDragEnd}
            onDrag={(e) => handleElementResize(e, resizeMode.topLeft)}
            bounds="parent"
            position={{ x: anchorCircleSize / -2, y: anchorCircleSize / -2 }}
          >
            <div className="w-[200%] h-[200%] "></div>
          </Draggable>
        </div>

        {/* top right circle anchor */}
        <div
          style={{
            width: anchorCircleSize + 'px',
            height: anchorCircleSize + 'px',
            top: anchorCircleSize / -2 + 'px',
            right: anchorCircleSize / -2 + 'px',
            borderWidth: 2.0 / scale + 'px'
          }}
          className=" rounded-full border-indigo-400  bg-white absolute cursor-ne-resize"
        >
          <Draggable
            onStart={handleDragStart}
            onStop={handleDragEnd}
            onDrag={(e) => handleElementResize(e, resizeMode.topRight)}
            bounds="parent"
            position={{ x: anchorCircleSize / -2, y: anchorCircleSize / -2 }}
          >
            <div className="w-[200%] h-[200%] "></div>
          </Draggable>
        </div>

        {/* bottom left circle anchor */}
        <div
          style={{
            width: anchorCircleSize + 'px',
            height: anchorCircleSize + 'px',
            bottom: anchorCircleSize / -2 + 'px',
            left: anchorCircleSize / -2 + 'px',
            borderWidth: 2.0 / scale + 'px'
          }}
          className=" rounded-full border-indigo-400 bg-white absolute cursor-sw-resize"
        >
          <Draggable
            onStart={handleDragStart}
            onStop={handleDragEnd}
            onDrag={(e) => handleElementResize(e, resizeMode.bottomLeft)}
            bounds="parent"
            position={{ x: anchorCircleSize / -2, y: anchorCircleSize / -2 }}
          >
            <div className="w-[200%] h-[200%] "></div>
          </Draggable>
        </div>

        {/* bottom right circle anchor */}
        <div
          style={{
            width: anchorCircleSize + 'px',
            height: anchorCircleSize + 'px',
            bottom: anchorCircleSize / -2 + 'px',
            right: anchorCircleSize / -2 + 'px',
            borderWidth: 2.0 / scale + 'px'
          }}
          className=" rounded-full border-indigo-400 bg-white absolute cursor-se-resize"
        >
          <Draggable
            onStart={handleDragStart}
            onStop={handleDragEnd}
            onDrag={(e) => handleElementResize(e, resizeMode.bottomRight)}
            bounds="parent"
            position={{ x: anchorCircleSize / -2, y: anchorCircleSize / -2 }}
          >
            <div className="w-[200%] h-[200%] "></div>
          </Draggable>
        </div>
      </div>
    </div>
  );
}

export default CanvasElementContainer;
