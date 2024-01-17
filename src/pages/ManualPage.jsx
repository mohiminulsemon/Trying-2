import React from 'react';
import ClickAwayListener from 'react-click-away-listener';
import Draggable from 'react-draggable';

function ManualPage() {
  // ------------------------------------------------------------------------------
  // variables
  // ------------------------------------------------------------------------------

  // ------------------------------------------------------------------------------
  // functions
  // ------------------------------------------------------------------------------

  // ------------------------------------------------------------------------------
  // render
  // ------------------------------------------------------------------------------
  return (
    <ClickAwayListener onClickAway={(e) => console.log(123)}>
      <div className="bg-green-300 w-auto">
        <Draggable>
          <div className="w-[100px] h-[100px] bg-red-300"></div>
        </Draggable>
      </div>
    </ClickAwayListener>
  );
}

export default ManualPage;
