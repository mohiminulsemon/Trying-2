import React, { useState, useRef, useEffect } from 'react';
import { CanvasElementContainerV2 } from '..';
import { useSelector, useDispatch } from 'react-redux';
import Draggable from 'react-draggable';
import { setSelectedElementID, updateCanvasElement } from '../../features/canvasSlice';
import ClickAwayListener from 'react-click-away-listener';
import { contentAlign } from '../../utils/constants';
import { diffPoints, scalePoint } from '../../utils/canvas';
import { rotatePoints } from '../../utils/utils';

function CanvasTextV2({ element }) {
  // ------------------------------------------------------------------------------
  // variables
  // ------------------------------------------------------------------------------
  const dispatch = useDispatch();

  const mouse = useSelector((state) => state.persist.appReducer.mouse);
  const scale = useSelector((state) => state.persist.canvasReducer.selectedCanvas.scale);

  const [editable, setEditable] = useState(true);
  const [texts, setTexts] = useState([
    {
      text: 'アニメーション'
    }
  ]);
  const [rotation, setRotation] = useState(0);
  const [rotateOrigin, setRotateOrigin] = useState({
    x: element.left + element.width / 2,
    y: element.top + element.height / 2
  });

  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const editRef = useRef(null);

  const [elementTop, setElementTop] = useState(element.top);
  const [elementLeft, setElementLeft] = useState(element.left);

  // ------------------------------------------------------------------------------
  // functions
  // ------------------------------------------------------------------------------
  const handleMouseMove = () => {
    lastMousePosRef.current = mouse;
  };

  const handleElementMove = (event, dragElement) => {
    event.preventDefault();
    console.log('dragElement :>> ', dragElement);

    const lastMousePos = lastMousePosRef.current;
    const currentMousePos = mouse;
    lastMousePosRef.current = currentMousePos;

    let mouseDiff = diffPoints(currentMousePos, lastMousePos);
    mouseDiff = scalePoint(mouseDiff, scale);

    // setElementLeft(dragElement.x);
    // setElementTop(dragElement.y);

    // const { x, y } = deltaPosition;

    // setDeltaPosition({
    //     x: x + ui.deltaX,
    //     y: y + ui.deltaY,
    // });

    // setRotation(rotation + ui.deltaX / 20);

    const orign = { x: dragElement.x, y: dragElement.y };
    const point = { x: dragElement.deltaX, y: dragElement.deltaY };
    // const rotate = rotatePoints(point, rotation, orign);

    const updatedElement = {
      ...element,
      top: element.top + dragElement.deltaY,
      left: element.left + dragElement.deltaX
    };
    // console.log(updatedElement);
    const newOrigin = {
      x: updatedElement.left + updatedElement.width / 2,
      y: updatedElement.top + updatedElement.height / 2
    };
    console.log('newOrigin :>> ', newOrigin);

    setRotateOrigin(newOrigin);
    dispatch(updateCanvasElement(updatedElement));
  };

  const handleElementSelect = (event) => {
    console.log('select');
    const updatedElement = {
      ...element,
      selected: true
    };

    dispatch(updateCanvasElement(updatedElement));
    dispatch(setSelectedElementID(updatedElement.id));
  };

  const handleDblClick = () => {
    console.log('dbl click');
    setEditable(true);
    console.log(editRef.current.focus);

    const test = () => {
      editRef.current.focus();
      editRef.current.anchorOffset = 2;
    };
    setTimeout(() => editRef.current.focus(), 0);
  };

  const handleTextSelect = (event) => {
    console.log('something select');
    console.log(window.getSelection().toString());
    console.log(window.getSelection().anchorOffset);
    console.log(window.getSelection().extentOffset);
  };

  const handleClickAway = () => {
    const updatedElement = {
      ...element,
      selected: false
    };

    dispatch(updateCanvasElement(updatedElement));
    setEditable(false);
  };

  const handleEditTextKeyDown = (event) => {
    if (event.key == 'Enter') {
      // event.preventDefault();

      console.log('enter hit');

      const anchorOffset = window.getSelection().anchorOffset;

      let stringLength;

      texts.find();

      console.log('anchorOffset :>> ', anchorOffset);
    }
  };

  // ------------------------------------------------------------------------------
  // render
  // ------------------------------------------------------------------------------
  return (
    <ClickAwayListener onClickAway={() => handleClickAway()}>
      <div
        style={{
          transform: 'rotate(' + (element?.rotate ?? 0) + 'deg)',
          transformOrigin: `${rotateOrigin.x}px ${rotateOrigin.y}px`
        }}
        className=""
      >
        <Draggable
          onDrag={handleElementMove}
          position={{ x: element.left, y: element.top }}
          disabled={editable}
          scale={scale}
        >
          <div
            onMouseMove={handleMouseMove}
            onClick={(e) => handleElementSelect(e)}
            onDoubleClick={(e) => handleDblClick(e)}
            style={{
              width: element?.width + 'px',
              height: element?.height + 'px',
              color: element?.color,
              backgroundColor: element?.backgroundColor,
              borderColor: element?.borderColor,
              borderWidth: element?.border + 'px',
              borderRadius: element?.borderRadius + 'px'
              // transform: 'rotate(' + (element?.rotate ?? 0) + 'deg)'
            }}
            className={
              (!element.selected
                ? 'hover:ring-indigo-400 hover:ring-[8px]'
                : 'ring-indigo-400 ring-[8px]') + '  cursor-pointer '
            }
          >
            <div
              suppressContentEditableWarning={true}
              contentEditable={editable}
              onSelect={(e) => handleTextSelect(e)}
              onKeyDown={(e) => handleEditTextKeyDown(e)}
              className={(editable ? '' : 'prevent-select') + ' outline-none bg-transparent '}
              ref={editRef}
              style={{
                fontSize: element?.fontSize,

                justifyContent: element?.justify,
                alignItems: element?.itemAlign,
                textAlign:
                  element?.justify == contentAlign.justfiyCenter
                    ? 'center'
                    : element?.justify == contentAlign.justifyStart
                      ? 'left'
                      : 'right'
              }}
            >
              {texts.map((data, index) => (
                <span key={index}>{data.text}</span>
              ))}
              {/* test {editable ? 'true' : 'false'} */}
            </div>
          </div>
        </Draggable>

        {element.selected && <CanvasElementContainerV2 element={element} />}
      </div>
    </ClickAwayListener>
  );
}

export default CanvasTextV2;
