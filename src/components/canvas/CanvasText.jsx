import { React } from 'react';
import { CanvasElementContainer } from '..';
import { useDispatch } from 'react-redux';
import {
  setAllElementSelected,
  setSelectedElementID,
  updateCanvasElement
} from '../../features/canvasSlice';
import { contentAlign } from '../../utils/constants';
import ClickAwayListener from 'react-click-away-listener';

function CanvasText({ element }) {
  // ------------------------------------------------------------------------------
  // variables
  // ------------------------------------------------------------------------------
  const dispatch = useDispatch();

  // ------------------------------------------------------------------------------
  // functions
  // ------------------------------------------------------------------------------
  const handleSelect = (event, value) => {
    // event.preventDefault();
    console.log('text element clicked');
    let updatedElement = {
      ...element
    };

    dispatch(setAllElementSelected(false));

    updatedElement.selected = value;
    dispatch(updateCanvasElement(updatedElement));
    dispatch(setSelectedElementID(updatedElement.id));
  };

  const handleUnselect = () => {
    console.log('object');
    const updatedElement = {
      ...element,
      selected: false
    };

    dispatch(updateCanvasElement(updatedElement));
    // setEditable(false);
  };
  // ------------------------------------------------------------------------------
  // render
  // ------------------------------------------------------------------------------
  return (
    //<ClickAwayListener onClickAway={handleUnselect}>
    <CanvasElementContainer element={element}>
      <div
        onClick={(e) => handleSelect(e, true)}
        onDoubleClick={(e) => handleDbClick(e)}
        style={{
          color: element?.color,
          backgroundColor: element?.backgroundColor,
          borderColor: element?.borderColor,
          borderWidth: element?.border + 'px',
          borderRadius: element?.borderRadius + 'px',
          fontSize: element?.fontSize,
          transform: 'rotate(' + (element?.rotate ?? 0) + 'deg)',
          justifyContent: element?.justify,
          alignItems: element?.itemAlign,
          textAlign:
            element?.justify == contentAlign.justfiyCenter
              ? 'center'
              : element?.justify == contentAlign.justifyStart
                ? 'left'
                : 'right'
        }}
        className={
          (element.selected ? '' : 'prevent-select ') + 'flex w-full h-full text-balance break-all'
        }
      >
        {element?.text}
      </div>
    </CanvasElementContainer>
    //</ClickAwayListener>
  );
}

export default CanvasText;
