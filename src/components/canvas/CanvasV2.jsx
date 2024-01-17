import React, { useRef, useEffect, useState, useCallback } from 'react';
import { addPoints, diffPoints } from '../../utils/canvas';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateCanvasOffset,
  updateCanvasScale,
  setIsSpaceKeyHeld,
  deleteSelectedElement
} from '../../features/canvasSlice';
import { CanvasText } from '..';
import { canvasElementType } from '../../utils/constants';
import CanvasCircle from './CanvasCircle';
import Line from '../shapes/Line';
import Square from '../shapes/Square';
import { retry } from '@reduxjs/toolkit/query';
import Triangle from '../shapes/Triangle';
import Pentagon from '../shapes/Pentagon';
import { Resizable } from 're-resizable';
import Draggable from 'react-draggable';

function CanvasV2({ width, height }) {
  // ------------------------------------------------------------------------------
  // variables
  // ------------------------------------------------------------------------------

  const ZOOM_SENSITIVITY = 0.03;
  const ORIGIN = { x: 0, y: 0 };

  const dispatch = useDispatch();
  const selectedCanvas = useSelector((state) => state.persist.canvasReducer.selectedCanvas);
  const isSpaceKeyHeld = useSelector((state) => state.persist.canvasReducer.isSpaceKeyHeld);

  const mainRef = useRef(null);
  const lastMousePosRef = useRef(ORIGIN);

  const [offset, setOffset] = useState(selectedCanvas.offset);

  // const [isSpaceKeyHeld, setIsSpaceKeyHeld] = useState(false);
  const [isCanvasPan, setIsCanvasPan] = useState(false);

  const [shapeWidth, setShapeWidth] = useState('250px');
  const [shapeHeight, setShapeHeight] = useState('250px');

  // ------------------------------------------------------------------------------
  // function
  // ------------------------------------------------------------------------------

  // function for panning
  const handleMouseMove = useCallback(
    (event) => {
      // event.preventDefault();
      if (isSpaceKeyHeld) {
        setIsCanvasPan(true);
        console.log('mouse move');
        const lastMousePos = lastMousePosRef.current;
        const currentMousePos = { x: event.pageX, y: event.pageY };
        lastMousePosRef.current = currentMousePos;

        const mouseDiff = diffPoints(currentMousePos, lastMousePos);
        setOffset((prevOffset) => addPoints(prevOffset, mouseDiff));
      }
    },
    [isSpaceKeyHeld]
  );

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    setIsCanvasPan(false);
  }, [handleMouseMove]);

  const handlePan = useCallback(
    (event) => {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      lastMousePosRef.current = { x: event.pageX, y: event.pageY };
    },
    [handleMouseMove, handleMouseUp]
  );

  // set up wheel event
  useEffect(() => {
    const mainElem = mainRef.current;
    if (mainElem === null) return;

    const handleWheel = (event) => {
      event.preventDefault();

      if (event.ctrlKey) {
        if (event.deltaY > 0) {
          // scale up
          // console.log(selectedCanvas.scale);
          let newScale = selectedCanvas.scale - ZOOM_SENSITIVITY;
          newScale = newScale < 0.1 ? 0.1 : newScale;

          dispatch(updateCanvasScale(newScale));
        } else {
          // scale down
          const newScale = selectedCanvas.scale + ZOOM_SENSITIVITY;
          dispatch(updateCanvasScale(newScale));
        }
      }

      //   console.log(event.deltaY);
      //   const zoom = 1 - event.deltaY / ZOOM_SENSITIVITY;
      //   setScale(scale * zoom);
    };

    mainElem.addEventListener('wheel', handleWheel);
    return () => {
      mainElem.removeEventListener('wheel', handleWheel);
    };
  }, [selectedCanvas.scale]);

  // set up key down event
  useEffect(() => {
    const handleKeyDown = (event) => {
      // check space key is down

      if (event.keyCode === 32) {
        dispatch(setIsSpaceKeyHeld(true));
      }
    };
    const handleKeyUp = (event) => {
      if (event.keyCode === 32) {
        dispatch(setIsSpaceKeyHeld(false));
      } else if (event.keyCode === 46) {
        // delete key up
        // delete selected canvas element
        dispatch(deleteSelectedElement());
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [isSpaceKeyHeld]);

  useEffect(() => {
    if (offset.x != null && offset.y != null) {
      dispatch(updateCanvasOffset(offset));
    }
  }, [offset]);

  useEffect(() => {
    setOffset(selectedCanvas.offset);
  }, [selectedCanvas]);

  // new code
  const [elements, setElements] = React.useState([]);
  console.log({ elements });
  const handleElementResize = (index, data = { width: undefined, height: undefined }) => {
    const newElems = elements.slice(0);
    const elem = newElems[index];
    elem.width = data.width || elem.width;
    elem.height = data.height || elem.height;
    setElements(newElems);
  };
  const handleElementMove = (index, data = { x: undefined, y: undefined }) => {
    const newElems = elements.slice(0);
    const elem = newElems[index];
    elem.x = data.x || elem.x;
    elem.y = data.y || elem.y;
    setElements(newElems);
  };
  // ------------------------------------------------------------------------------
  // render
  // ------------------------------------------------------------------------------
  return (
    <div
      onMouseDown={handlePan}
      ref={mainRef}
      style={{ width: width + 'px', height: height + 'px' }}
      className={
        (isSpaceKeyHeld && 'cursor-grab ') +
        (isCanvasPan && 'cursor-grabbing ') +
        ' relative ease-in-out duration-300 overflow-auto no-scrollbar'
      }
    >
      {/* <div className="bg-blue-500  w-full">
        offset : x : {selectedCanvas.offset.x} y : {selectedCanvas.offset.y}
        <br />
        isSpaceHeld : {isSpaceKeyHeld ? 'true' : 'false'}
        <br />
        width : {width / scale}
        <br />
        height : {height / scale}
        <br />
        scale : {scale}
      </div> */}

      <div
        style={{
          scale: selectedCanvas?.scale?.toString(),
          top: selectedCanvas?.offset?.y + 'px',
          left: selectedCanvas?.offset?.x + 'px'
        }}
        className="origin-center  absolute "
      >
        {/* main content */}
        <div
          id="canvas-card"
          style={{
            resize: 'both',
            top: '0px',
            left: '0px',
            width: selectedCanvas?.width,
            height: selectedCanvas?.height
          }}
          className="bg-white absolute"
          onDrop={(e) => {
            console.dir(e.dataTransfer.getData('shape'));
            setElements((elems) => {
              const newElem = JSON.parse(e.dataTransfer.getData('shape') || '{}');
              if (!newElem.type) return elems;
              return [
                ...elems,
                {
                  ...newElem,
                  width: 150,
                  height: newElem.type.toLowerCase() === 'line' ? 30 : 150
                }
              ];
            });
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          {/* render all element */}
          {/* {selectedCanvas?.elements.map((element) => {
              if (element.type == canvasElementType.text) {
                return <CanvasText key={element.id} element={element} />;
              } else if (element.type == canvasElementType.circle) {
                return <CanvasCircle key={element.id} element={element} />;
              } else if (element.type == canvasElementType.line) {
                return <Line key={element.id} element={element} />;
              } else if (element.type == canvasElementType.square) {
                return <Square key={element.id} element={element} />;
              } else if (element.type == canvasElementType.triangle) {
                return <Triangle key={element.id} element={element} />;
              } else if (element.type == canvasElementType.pentagon) {
                <Pentagon key={element.id} element={element} />;
              }
            })} */}
          {/* circle */}
          {elements.map((element, idx) => {
            if (element.type.toLowerCase() === 'square') {
              return (
                <Resizable
                  size={{ width: element.width, height: element.height }}
                  onResizeStop={(e, direction, ref, d) => {
                    handleElementResize(idx, d);
                  }}
                  resizeRatio={1}
                  lockAspectRatio
                  key={idx}
                  // className="absolute top-0 right-0 bottom-0 left-0"
                  style={{
                    // position: 'absolute',
                    top: element.x || '5%',
                    left: element.y || '5%'
                  }}
                >
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundColor: ' #9ca3af'
                    }}
                    draggable
                    onDragEnd={(e) => handleElementMove(idx, { x: e.clientX, y: e.clientY })}
                  ></div>
                </Resizable>
              );
            } else if (element.type.toLowerCase() === 'triangle') {
              return (
                <Resizable
                  size={{ width: element.width, height: element.height }}
                  onResizeStop={(e, direction, ref, d) => {
                    handleElementResize(idx, d);
                  }}
                  key={idx}
                  // className="absolute top-0 right-0 bottom-0 left-0"
                  style={{
                    // position: 'absolute',
                    top: element.x || '5%',
                    left: element.y || '5%'
                  }}
                >
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundColor: ' #9ca3af',
                      clipPath: 'polygon(50% 0, 100% 100%, 0 100%)'
                    }}
                    draggable
                    onDragEnd={(e) => handleElementMove(idx, { x: e.clientX, y: e.clientY })}
                  ></div>
                </Resizable>
              );
            } else if (element.type.toLowerCase() === 'pentagon') {
              return (
                <Resizable
                  size={{ width: element.width, height: element.height }}
                  onResizeStop={(e, direction, ref, d) => {
                    handleElementResize(idx, d);
                  }}
                  key={idx}
                  // className="absolute top-0 right-0 bottom-0 left-0"
                  style={{
                    // position: 'absolute',
                    top: element.x || '5%',
                    left: element.y || '5%'
                  }}
                >
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundColor: ' #9ca3af',
                      clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'
                    }}
                    draggable
                    onDragEnd={(e) => handleElementMove(idx, { x: e.clientX, y: e.clientY })}
                  ></div>
                </Resizable>
              );
            } else if (element.type.toLowerCase() === 'line') {
              return (
                <Resizable
                  size={{ width: element.width, height: element.height }}
                  onResizeStop={(e, direction, ref, d) => {
                    handleElementResize(idx, d);
                  }}
                  key={idx}
                  // className="absolute top-0 right-0 bottom-0 left-0"
                  style={{
                    // position: 'absolute',
                    top: element.x || '5%',
                    left: element.y || '5%'
                  }}
                >
                  <div
                    className="w-full h-full"
                    style={{
                      borderBottom: '10px solid #9ca3af',
                      borderBottomWidth: element.height
                    }}
                    draggable
                    onDragEnd={(e) => handleElementMove(idx, { x: e.clientX, y: e.clientY })}
                  ></div>
                </Resizable>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}

export default CanvasV2;
