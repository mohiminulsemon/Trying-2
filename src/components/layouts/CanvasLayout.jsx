import React, { useState, useLayoutEffect } from 'react';
import { Outlet } from 'react-router-dom';
import {
  CanvasHeader,
  CanvasRightSidebar,
  CanvasSidebar,
  CanvasSidebarDetail,
  CreateProjectModal
} from '..';
import { useSelector, useDispatch } from 'react-redux';
import { canvasLayout } from '../../utils/constants';
import { setCanvasContentWidth, setCanvasContentHeight } from '../../features/canvasSlice';

function CanvasLayout() {
  // ------------------------------------------------------------------------------
  // variables
  // ------------------------------------------------------------------------------
  const dispatch = useDispatch();

  const isCreateProjectModalOpen = useSelector(
    (state) => state.projectReducer.isCreateProjectModalOpen
  );

  const rightSidebar = useSelector((state) => state.persist.canvasReducer.rightSidebar);
  const sidebarDetail = useSelector((state) => state.persist.canvasReducer.sidebarDetail);
  const screen = useSelector((state) => state.persist.appReducer.screen);

  const [contentWidth, setContentWidth] = useState(
    window.innerWidth - sidebarDetail.width - rightSidebar.width - 70
  );
  // ------------------------------------------------------------------------------
  // functions
  // ------------------------------------------------------------------------------

  // update canvas content size
  useLayoutEffect(() => {
    if (sidebarDetail.open && rightSidebar.open) {
      const newContentWidth = screen.x - sidebarDetail.width - rightSidebar.width - 69;
      dispatch(setCanvasContentWidth(newContentWidth - 32));
      setContentWidth(newContentWidth);
    } else if (sidebarDetail.open && !rightSidebar.open) {
      const newContentWidth = screen.x - sidebarDetail.width - 70;
      dispatch(setCanvasContentWidth(newContentWidth - 32));
      setContentWidth(newContentWidth);
    } else if (!sidebarDetail.open && rightSidebar.open) {
      const newContentWidth = screen.x - rightSidebar.width - 69;
      dispatch(setCanvasContentWidth(newContentWidth - 32));
      setContentWidth(newContentWidth);
    } else {
      const newContentWidth = screen.x - 70;
      dispatch(setCanvasContentWidth(newContentWidth - 32));
      setContentWidth(newContentWidth);
    }

    dispatch(
      setCanvasContentHeight(screen.y - canvasLayout.headerHeight - canvasLayout.canvasHeaderHeight)
    );
  }, [sidebarDetail, rightSidebar, screen]);
  // ------------------------------------------------------------------------------
  // render
  // ------------------------------------------------------------------------------
  return (
    <div
      className="w-screen h-screen overflow-hidden 
          bg-cyan-50 dark:bg-zinc-700"
    >
      <CanvasSidebar />

      <CanvasRightSidebar />
      <div
        style={{
          width: contentWidth + 'px',
          left: sidebarDetail.open ? sidebarDetail.width + 65 + 'px' : '65px'
        }}
        className={
          (rightSidebar.resizing ? 'duration-0' : 'duration-300') +
          (sidebarDetail.resizing ? 'duration-300' : '') +
          ' absolute top-0 ease-in-out  '
        }
      >
        {/* content */}
        <div
          style={{ top: canvasLayout.headerHeight }}
          className="px-[16px] w-full h-[calc(100vh-36px)] overflow-hidden absolute "
        >
          <Outlet />
        </div>

        {/* header */}
        <div className="absolute top-0 left-0">
          <CanvasHeader />
        </div>
      </div>

      {/* sidebar */}
      <CanvasSidebarDetail />
      <CanvasSidebar />

      {/* full screen modal */}

      {/* create project modal */}
      {isCreateProjectModalOpen && <CreateProjectModal />}
    </div>
  );
}

export default CanvasLayout;
