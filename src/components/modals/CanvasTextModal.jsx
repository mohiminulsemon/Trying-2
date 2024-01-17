import React from 'react';
import { useDispatch } from 'react-redux';
import { canvasElementType, contentAlign, itemAlign } from '../../utils/constants';
import { addCanvasElement } from '../../features/canvasSlice';

function CanvasTextModal() {
  // ------------------------------------------------------------------------------
  // variables
  // ------------------------------------------------------------------------------
  const dispatch = useDispatch();

  // ------------------------------------------------------------------------------
  // functions
  // ------------------------------------------------------------------------------
  const handleCreateElement = () => {
    const element = {
      type: canvasElementType.text,
      width: 500,
      height: 500,
      top: 100,
      left: 100,
      selected: true,
      color: '#000',
      backgroundColor: '#fff',
      borderColor: '#000',
      border: 0,
      borderRadius: 0,
      fontSize: 200,
      rotate: 0,
      justify: contentAlign.justifyStart,
      itemAlign: itemAlign.itemStart,
      text: 'テキスト'
    };

    dispatch(addCanvasElement(element));
  };

  const test = () => {
    const element = {
      type: canvasElementType.textV2,
      width: 500,
      height: 500,
      top: 100,
      left: 100,
      selected: true,
      color: '#000',
      backgroundColor: '#fff',
      borderColor: '#000',
      border: 0,
      borderRadius: 0,
      fontSize: 200,
      rotate: 0,
      justify: contentAlign.justifyStart,
      itemAlign: itemAlign.itemStart,
      text: 'テキスト'
    };
    dispatch(addCanvasElement(element));
  };
  // ------------------------------------------------------------------------------
  // render
  // ------------------------------------------------------------------------------
  return (
    <div className="w-full h-full pt-10 px-2 text-zinc-700 dark:text-zinc-100">
      <div
        onClick={handleCreateElement}
        className="w-full h-[30px] dark:bg-indigo-400 bg-indigo-300  rounded-sm prevent-select
        flex justify-center items-center text-sm cursor-pointer hover:dark:bg-indigo-500 hover:bg-indigo-400"
      >
        テクストボックスを追加
      </div>

      <div
        onClick={test}
        className="w-full h-[30px] dark:bg-indigo-400 bg-indigo-300  rounded-sm prevent-select mt-4
        flex justify-center items-center text-sm cursor-pointer hover:dark:bg-indigo-500 hover:bg-indigo-400"
      >
        バウンディングボックスでテクストの追加
      </div>
    </div>
  );
}

export default CanvasTextModal;
