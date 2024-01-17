import React from 'react';
import { CanvasContentHeader, CanvasV2 } from '../components';
import { useSelector } from 'react-redux';

function CanvasPage() {
  const canvas = useSelector((state) => state.persist.canvasReducer.canvas);

  const canvasContentWidth = useSelector((state) => state.persist.canvasReducer.canvasContentWidth);
  const canvasContentHeight = useSelector(
    (state) => state.persist.canvasReducer.canvasContentHeight
  );

  return (
    <div className=" w-full h-full rounded-sm">
      {/* header */}
      <div className="w-full">
        <CanvasContentHeader />
      </div>

      {/* content h-[calc(100vh-61px)]*/}
      {canvas.length > 0 && (
        <div className="dark:bg-zinc-900 bg-zinc-300 w-full h-auto">
          {/* <Canvas height={contentHeight} width={contentWidth} /> */}
          <CanvasV2 width={canvasContentWidth} height={canvasContentHeight} />
        </div>
      )}
    </div>
  );
}

export default CanvasPage;
