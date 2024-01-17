import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SimpleBorder from '../utils/SimpleBorder';
import {
  CanvasFontFamilySelect,
  CanvasPropertiesColorInput,
  CanvasPropertiesIconButton,
  CanvasPropertiesNumberInput,
  CanvasPropertiesTextareaInput,
  ItemCenterIcon,
  ItemEndIcon,
  ItemStartIcon,
  JustifyCenterIcon,
  JustifyEndIcon,
  JustifyStartIcon
} from '..';
import { updateCanvasElement } from '../../features/canvasSlice';
import { contentAlign, itemAlign } from '../../utils/constants';

function CanvasTextPropertiesModal() {
  // ------------------------------------------------------------------------------
  // variables
  // ------------------------------------------------------------------------------
  const dispatch = useDispatch();

  const isDarkMode = useSelector((state) => state.persist.appReducer.isDarkMode);
  const selectedElementID = useSelector((state) => state.persist.canvasReducer.selectedElementID);
  const selectedCanvas = useSelector((state) => state.persist.canvasReducer.selectedCanvas);

  const [selectedElement, setSelectedElement] = useState(null);

  // ------------------------------------------------------------------------------
  // functions
  // ------------------------------------------------------------------------------
  const updateElement = (element) => {
    dispatch(updateCanvasElement(element));
  };

  const handleLeftChange = (value) => {
    const updatedElement = {
      ...selectedElement,
      left: parseInt(value)
    };
    // console.log('updatedElement :>> ', updatedElement);

    updateElement(updatedElement);
  };

  const handleTopChange = (value) => {
    const updatedElement = {
      ...selectedElement,
      top: parseInt(value)
    };
    // console.log('updatedElement :>> ', updatedElement);

    updateElement(updatedElement);
  };

  const handleWidthChange = (value) => {
    const updatedElement = {
      ...selectedElement,
      width: parseInt(value)
    };
    // console.log('updatedElement :>> ', updatedElement);

    updateElement(updatedElement);
  };

  const handleHeightChange = (value) => {
    const updatedElement = {
      ...selectedElement,
      height: parseInt(value)
    };
    // console.log('updatedElement :>> ', updatedElement);

    updateElement(updatedElement);
  };

  const handleBorderChange = (value) => {
    if (parseInt(value) <= 0) return;

    const updatedElement = {
      ...selectedElement,
      border: parseInt(value)
    };
    updateElement(updatedElement);
  };

  const handleRotateChange = (value) => {
    const updatedElement = {
      ...selectedElement,
      rotate: parseInt(value)
    };
    updateElement(updatedElement);
  };

  const handleBorderRadiusChange = (value) => {
    if (parseInt(value) <= 0) return;

    const updatedElement = {
      ...selectedElement,
      borderRadius: parseInt(value)
    };
    updateElement(updatedElement);
  };

  const handleColorChange = (value) => {
    const updatedElement = {
      ...selectedElement,
      color: value
    };

    updateElement(updatedElement);
  };

  const handleBackgroundColorChange = (value) => {
    const updatedElement = {
      ...selectedElement,
      backgroundColor: value
    };

    updateElement(updatedElement);
  };

  const handleBorderColorChange = (value) => {
    const updatedElement = {
      ...selectedElement,
      borderColor: value
    };

    updateElement(updatedElement);
  };

  const handleFontSizeChange = (value) => {
    if (parseInt(value) <= 0) return;

    const updatedElement = {
      ...selectedElement,
      fontSize: parseInt(value)
    };
    updateElement(updatedElement);
  };

  const handleJustifyChange = (value) => {
    const updatedElement = {
      ...selectedElement,
      justify: value
    };
    updateElement(updatedElement);
  };

  const handleItemAlignChange = (value) => {
    const updatedElement = {
      ...selectedElement,
      itemAlign: value
    };
    updateElement(updatedElement);
  };

  const handleTextChange = (value) => {
    const updatedElement = {
      ...selectedElement,
      text: value
    };
    updateElement(updatedElement);
  };

  useEffect(() => {
    if (selectedElementID !== -1 && selectedCanvas !== null) {
      const result = selectedCanvas.elements?.find((element) => {
        if (element.id === selectedElementID) {
          return element;
        }
      });
      setSelectedElement(result);
    } else {
      setSelectedElement(null);
    }
  }, [selectedCanvas, selectedElementID]);

  // ------------------------------------------------------------------------------
  // render
  // ------------------------------------------------------------------------------
  return (
    <div className="w-full h-full p-2 text-zinc-700 dark:text-zinc-300 text-sm">
      Text Properties
      {selectedElementID}
      {/* border */}
      <div className="w-full my-3">
        <SimpleBorder />
      </div>
      {/* position info */}
      <div className="w-full space-y-1">
        <div className="w-full flex flex-wrap space-x-2">
          {/* elemnt position x */}
          <div className="w-[80px]">
            <CanvasPropertiesNumberInput
              label="X"
              value={parseInt(selectedElement?.left ?? 0)}
              onChange={handleLeftChange}
            />
          </div>
          {/* element position y */}
          <div className="w-[80px]">
            <CanvasPropertiesNumberInput
              label="Y"
              value={parseInt(selectedElement?.top ?? 0)}
              onChange={handleTopChange}
            />
          </div>
        </div>
        <div className="w-full flex flex-wrap space-x-2">
          {/* element width */}
          <div className="w-[80px]">
            <CanvasPropertiesNumberInput
              label="W"
              value={parseInt(selectedElement?.width ?? 0)}
              onChange={handleWidthChange}
            />
          </div>
          {/* element height */}
          <div className="w-[80px]">
            <CanvasPropertiesNumberInput
              label="H"
              value={parseInt(selectedElement?.height ?? 0)}
              onChange={handleHeightChange}
            />
          </div>
          {/* element border  */}
          <div className="w-[80px]">
            <CanvasPropertiesNumberInput
              label="B"
              value={selectedElement?.border}
              onChange={handleBorderChange}
            />
          </div>
        </div>
        <div className="w-full flex flex-wrap space-x-2">
          {/* element rotate */}
          <div className="w-[80px]">
            <CanvasPropertiesNumberInput
              specialLabel="&#x22be;"
              value={parseInt(selectedElement?.rotate ?? 0)}
              onChange={handleRotateChange}
              min={0}
            />
          </div>
          {/* element border radius */}
          <div className="w-[80px]">
            <CanvasPropertiesNumberInput
              specialLabel="&#x221f;"
              value={selectedElement?.borderRadius}
              onChange={handleBorderRadiusChange}
              min={0}
            />
          </div>
        </div>
      </div>
      {/* border */}
      <div className="w-full my-3">
        <SimpleBorder />
      </div>
      {/* color */}
      <div className="w-full space-y-1">
        <CanvasPropertiesColorInput
          label="背景色"
          color={selectedElement?.backgroundColor}
          onChange={handleBackgroundColorChange}
        />
        <CanvasPropertiesColorInput
          label="テキスト色"
          color={selectedElement?.color}
          onChange={handleColorChange}
        />
        <CanvasPropertiesColorInput
          label="ボーダー色"
          color={selectedElement?.borderColor}
          onChange={handleBorderColorChange}
        />
      </div>
      {/* border */}
      <div className="w-full my-3">
        <SimpleBorder />
      </div>
      {/* text align */}
      <div className="w-full space-y-1 mb-1">
        <div className="w-full flex space-x-2">
          <CanvasPropertiesIconButton
            onClick={() => handleJustifyChange(contentAlign.justifyStart)}
            selected={selectedElement?.justify == contentAlign.justifyStart}
            icon={<JustifyStartIcon color={isDarkMode ? '#fff' : '#000'} />}
          />

          <CanvasPropertiesIconButton
            onClick={() => handleJustifyChange(contentAlign.justfiyCenter)}
            selected={selectedElement?.justify == contentAlign.justfiyCenter}
            icon={<JustifyCenterIcon color={isDarkMode ? '#fff' : '#000'} />}
          />

          <CanvasPropertiesIconButton
            onClick={() => handleJustifyChange(contentAlign.justifyEnd)}
            selected={selectedElement?.justify == contentAlign.justifyEnd}
            icon={<JustifyEndIcon color={isDarkMode ? '#fff' : '#000'} />}
          />
        </div>

        <div className="w-full flex space-x-2">
          <CanvasPropertiesIconButton
            onClick={() => handleItemAlignChange(itemAlign.itemStart)}
            selected={selectedElement?.itemAlign == itemAlign.itemStart}
            icon={<ItemStartIcon color={isDarkMode ? '#fff' : '#000'} />}
          />

          <CanvasPropertiesIconButton
            onClick={() => handleItemAlignChange(itemAlign.itemCenter)}
            selected={selectedElement?.itemAlign == itemAlign.itemCenter}
            icon={<ItemCenterIcon color={isDarkMode ? '#fff' : '#000'} />}
          />

          <CanvasPropertiesIconButton
            onClick={() => handleItemAlignChange(itemAlign.itemEnd)}
            selected={selectedElement?.itemAlign == itemAlign.itemEnd}
            icon={<ItemEndIcon color={isDarkMode ? '#fff' : '#000'} />}
          />
        </div>
      </div>
      {/* font size */}
      <div className="w-full space-y-1">
        <CanvasPropertiesNumberInput
          label="フォントサイズ"
          value={parseInt(selectedElement?.fontSize ?? 0)}
          onChange={handleFontSizeChange}
          textAlign="text-right"
        />
      </div>
      {/* font family */}
      <div className="w-full mt-1 space-y-1">
        <CanvasFontFamilySelect />
      </div>
      {/* text */}
      <div className="w-full space-y-1 mt-2">
        <CanvasPropertiesTextareaInput
          value={selectedElement?.text ?? ''}
          onChange={handleTextChange}
        />
      </div>
    </div>
  );
}

export default CanvasTextPropertiesModal;
