import React from 'react';
import CanvasElementContainer from './CanvasElementContainer';
import { useDispatch } from 'react-redux';
import { setAllElementSelected, updateCanvasElement } from '../../features/canvasSlice';

function CanvasImage({ element }) {
  // ------------------------------------------------------------------------------
  // variables
  // ------------------------------------------------------------------------------

  const dispatch = useDispatch();

  // ------------------------------------------------------------------------------
  // functions
  // ------------------------------------------------------------------------------
  const handleSelect = (value) => {
    let updatedElement = {
      ...element
    };

    dispatch(setAllElementSelected(false));

    updatedElement.selected = value;
    dispatch(updateCanvasElement(updatedElement));
  };

  // ------------------------------------------------------------------------------
  // render
  // ------------------------------------------------------------------------------
  return (
    <CanvasElementContainer element={element}>
      <img draggable="false"
        onClick={() => handleSelect(true)}
        style={{
          width: element.width,
          height: element.height
        }}
        src={element.src}
        loading='lazy'
      />
    </CanvasElementContainer>
  );
}

export default CanvasImage;