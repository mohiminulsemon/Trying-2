import { React, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Draggable from 'react-draggable';
import { updateCanvasElement } from '../../features/canvasSlice';

function CanvasElementContainerV2({ element }) {
  // ------------------------------------------------------------------------------
  // variables
  // ------------------------------------------------------------------------------
  const CIRCLE_RADIUS = 12.0;

  const dispatch = useDispatch();
  const scale = useSelector((state) => state.persist.canvasReducer.selectedCanvas.scale);

  const [anchorCircleSize, setAnchorCircleSize] = useState(CIRCLE_RADIUS / scale);
  // ------------------------------------------------------------------------------
  // functions
  // ------------------------------------------------------------------------------
  const handleRotate = (event, dragElement) => {
    const updatedElement = {
      ...element,
      rotate: element.rotate - dragElement.deltaX / 4.0
    };

    dispatch(updateCanvasElement(updatedElement));
    console.log(dragElement.deltaX);
  };

  useEffect(() => {
    if (scale > 1) {
      setAnchorCircleSize(CIRCLE_RADIUS);
    } else if (scale < 0.4) {
      setAnchorCircleSize(CIRCLE_RADIUS / 0.5);
    } else {
      setAnchorCircleSize(CIRCLE_RADIUS / scale);
    }
  }, [scale]);
  // ------------------------------------------------------------------------------
  // render
  // ------------------------------------------------------------------------------
  return (
    <div>
      {/* top left point */}
      {/* {scale} */}
      <div
        style={{
          width: `${anchorCircleSize}px`,
          height: `${anchorCircleSize}px`,
          borderWidth: `${2.0 / scale}px`,
          left: `${element.left - 10}px`,
          top: `${element.top - 10}px`
        }}
        className="absolute cursor-nw-resize bg-white
         rounded-full hover:bg-blue-300  border-blue-300 "
      ></div>

      {/* rotate */}
      <div
        style={{
          top: `${element.top + element.height + 20}px`,
          left: `${element.left + element.width / 2 - 25}px`
        }}
        className="absolute bg-yellow-300 w-[50px] h-[50px] rounded-full cursor-pointer"
      >
        <Draggable onDrag={handleRotate} axis="x" position={{ x: 0, y: 0 }}>
          <div className="w-full h-full "></div>
        </Draggable>
      </div>
    </div>
  );
}

export default CanvasElementContainerV2;
