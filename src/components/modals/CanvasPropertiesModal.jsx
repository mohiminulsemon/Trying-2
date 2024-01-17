import React, { useState, useEffect } from 'react';
import SimpleBorder from '../utils/SimpleBorder';
import {
  CanvasPropertiesColorInput,
  CanvasPropertiesNumberInput,
  CanvasPropertiesTextInput
} from '..';
import { useSelector, useDispatch } from 'react-redux';
import { updateSelectedCanvas } from '../../features/canvasSlice';

function CanvasPropertiesModal() {
  // ------------------------------------------------------------------------------
  // variables
  // ------------------------------------------------------------------------------
  const dispatch = useDispatch();
  const selectedCanvas = useSelector((state) => state.persist.canvasReducer.selectedCanvas);

  const [name, setName] = useState(selectedCanvas.name);
  const [height, setHeight] = useState(selectedCanvas.height);
  const [width, setWidth] = useState(selectedCanvas.width);
  const [color, setColor] = useState(selectedCanvas.color);

  // ------------------------------------------------------------------------------
  // functions
  // ------------------------------------------------------------------------------
  const updateCanvas = (canvas) => {
    dispatch(updateSelectedCanvas(canvas));
  };

  const handleNameChange = (value) => {
    setName(value);

    const updatedCanvas = {
      ...selectedCanvas,
      name: value
    };
    updateCanvas(updatedCanvas);
  };

  const handleHeightChange = (value) => {
    setHeight(parseInt(value));

    const updatedCanvas = {
      ...selectedCanvas,
      height: value
    };
    updateCanvas(updatedCanvas);
  };

  const handleWidthChange = (value) => {
    setWidth(parseInt(value));

    const updatedCanvas = {
      ...selectedCanvas,
      width: value
    };
    updateCanvas(updatedCanvas);
  };

  const handleColorChange = (value) => {
    setColor(value);

    const updatedCanvas = {
      ...selectedCanvas,
      color: value
    };
    updateCanvas(updatedCanvas);
  };

  useEffect(() => {
    setName(selectedCanvas.name);
    setHeight(selectedCanvas.height);
    setWidth(selectedCanvas.width);
    setColor(selectedCanvas.color);
  }, [selectedCanvas.id]);
  // ------------------------------------------------------------------------------
  // render
  // ------------------------------------------------------------------------------
  return (
    <div className="w-full h-full p-2 pe-5 text-zinc-700 dark:text-zinc-300 text-sm">
      Canvas Properties
      {/* border */}
      <div className="w-full my-3">
        <SimpleBorder />
      </div>
      {/* canvas info */}
      <div className="w-full  space-y-1">
        <div className="w-[200px]">
          <CanvasPropertiesTextInput label="名前 : " value={name} onChange={handleNameChange} />
        </div>

        <div className="w-full flex flex-wrap space-x-2">
          <div className="w-[100px]">
            <CanvasPropertiesNumberInput label="W" value={width} onChange={handleWidthChange} />
          </div>
          <div className="w-[100px]">
            <CanvasPropertiesNumberInput label="H" value={height} onChange={handleHeightChange} />
          </div>
        </div>
      </div>
      {/* border */}
      <div className="w-full my-3">
        <SimpleBorder />
      </div>
      {/* color */}
      <div className="w-full sapce-y-1">
        <CanvasPropertiesColorInput label="背景色" color={color} onChange={handleColorChange} />
      </div>
    </div>
  );
}

export default CanvasPropertiesModal;
