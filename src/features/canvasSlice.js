import { createSlice, nanoid } from '@reduxjs/toolkit';
import { sliceKeys } from '../utils/keys';
import { canvasElementType } from '../utils/constants';
// ==============================|| states ||============================== //
const initialState = {
  sidebarDetail: {
    width: 300,
    open: false,
    resizing: false
  },
  selectedSidebarItem: -1,

  rightSidebar: {
    width: 300,
    open: false,
    resizing: false
  },

  isHeaderMenuOpen: false,

  isSpaceKeyHeld: false,

  canvasContentWidth: -1,
  canvasContentHeight: -1,
  canvas: [],
  selectedCanvas: {},

  draggingElement: {},

  // selectedElement: {},
  selectedElementID: -1
};

// ==============================|| slice ||============================== //
export const canvasSlice = createSlice({
  name: sliceKeys.canvas,
  initialState,
  reducers: {
    // ------------------------------------------------------------------------------
    // ui manage actions
    // ------------------------------------------------------------------------------
    openSidebarDetail: (state, action) => {
      state.sidebarDetail.open = action.payload;
    },
    updateSidbarDetailWidth: (state, action) => {
      state.sidebarDetail.width = action.payload;
    },
    setSidebarIsResizing: (state, action) => {
      state.sidebarDetail.resizing = action.payload;
    },
    updateSelectedSidebarItem: (state, action) => {
      state.selectedSidebarItem = action.payload;
      state.sidebarDetail.open = true;
    },
    openCanvasHeaderMenu: (state, action) => {
      state.isHeaderMenuOpen = action.payload;
    },
    setIsSpaceKeyHeld: (state, action) => {
      state.isSpaceKeyHeld = action.payload;
    },
    updateRightSidebar: (state, action) => {
      state.rightSidebar = action.payload;
    },
    setCanvasContentWidth: (state, action) => {
      state.canvasContentWidth = action.payload;
    },
    setCanvasContentHeight: (state, action) => {
      state.canvasContentHeight = action.payload;
    },

    // ------------------------------------------------------------------------------
    // canvas manage actions
    // ------------------------------------------------------------------------------
    addCanvas: (state, action) => {
      // prepare new canvas object
      const newCanvas = {
        id: nanoid(), // generate unique id
        elements: [], // canvas element array
        ...action.payload
      };

      state.selectedCanvas = newCanvas;
      state.selectedElementID = -1;
      state.canvas.push(newCanvas);

    },
    setSelectedCanvas: (state, action) => {
      state.selectedCanvas = action.payload;
      state.selectedElementID = -1;
    },
    updateSelectedCanvas: (state, action) => {
      state.selectedCanvas = action.payload;
      console.log('state.selectedCanvas :>> ', state.selectedCanvas);

      state.canvas = state.canvas.map((canvas) => {
        if (canvas.id == action.payload.id) {
          canvas = action.payload;
        }
        return canvas;
      });
    },
    updateCanvas: (state, action) => {
      state.canvas = state.canvas.map((canvas) => {
        if (canvas.id == action.payload.id) {
          canvas = action.payload;
        }
        return canvas;
      });
    },
    deleteCanvas: (state, action) => {
      state.canvas = state.canvas.filter((data) => {
        if (data.id != action.payload) {
          return data;
        }
      });

      if (state.selectedCanvas.id == action.payload) {
        state.selectedCanvas = state.canvas[0] ?? {};
      }
    },
    updateCanvasScale: (state, action) => {
      state.selectedCanvas.scale = action.payload;
      state.canvas = state.canvas.filter((data) => {
        if (data.id == state.selectedCanvas.id) {
          data.scale = action.payload;
        }
        return data;
      });
    },
    updateCanvasOffset: (state, action) => {
      state.selectedCanvas.offset = action.payload;
      state.canvas = state.canvas.filter((data) => {
        if (data.id == state.selectedCanvas.id) {
          data.offset = action.payload;
        }
        return data;
      });
    },

    // ------------------------------------------------------------------------------
    // canvas element manage actions
    // ------------------------------------------------------------------------------
    addCanvasElement: (state, action) => {
      console.log('Adding canvas element:', action.payload);
      const newTextElement = {
        id: nanoid(),
        ...action.payload
      };
      // console.log(newTextElement);
      // state.selectedElement = newTextElement;
      state.selectedCanvas.elements = state.selectedCanvas.elements.map((element) => {
        element.selected = false;
        return element;
      });
      state.selectedCanvas.elements.push(newTextElement);
      state.canvas = state.canvas.map((data) => {
        if (data.id == state.selectedCanvas.id) {
          data = state.selectedCanvas;
        }
        return data;
      });
      console.log(state.canvas);
      console.log('Updated Redux store state:', state);
    },
    updateCanvasElement: (state, action) => {
      state.selectedCanvas.elements = state.selectedCanvas.elements.map((element) => {
        if (element.id == action.payload.id) {
          element = action.payload;
        }
        return element;
      });
      state.canvas = state.canvas.map((data) => {
        if (data.id == state.selectedCanvas.id) {
          data = state.selectedCanvas;
        }
        return data;
      });
      console.log('state.canvas :>> ', state.canvas);
    },
    setAllElementSelected: (state, action) => {
      // console.log('select all element');
      state.selectedCanvas.elements = state.selectedCanvas.elements.map((element) => {
        element.selected = action.payload;
        return element;
      });

      state.canvas = state.canvas.map((data) => {
        if (data.id == state.selectedCanvas.id) {
          data = state.selectedCanvas;
        }
        return data;
      });

      state.selectedElementID = -1;
    },
    deleteSelectedElement: (state) => {
      state.selectedCanvas.elements = state.selectedCanvas.elements.filter((element) => {
        if (!element.selected) {
          return element;
        }
      });

      state.canvas = state.canvas.map((data) => {
        if (data.id == state.selectedCanvas.id) {
          data = state.selectedCanvas;
        }
        return data;
      });
    },
    setDraggingElement: (state, action) => {
      state.draggingElement = action.payload;
    },
    setSelectedElementID: (state, action) => {
      // const result = state.selectedCanvas.elements.find((element) => {
      //   if (element.id == action.payload) return element;
      // });
      // console.log(result);
      // state.selectedElement = result;

      state.selectedElementID = action.payload;
      state.rightSidebar.open = true;
    }
  }
});

export const {
  openSidebarDetail,
  updateSidbarDetailWidth,
  setSidebarIsResizing,
  updateSelectedSidebarItem,
  openCanvasHeaderMenu,
  setIsSpaceKeyHeld,

  updateRightSidebar,

  addCanvas,
  setSelectedCanvas,
  updateSelectedCanvas,
  deleteCanvas,
  updateCanvasScale,
  updateCanvasOffset,

  setCanvasContentWidth,
  setCanvasContentHeight,

  addCanvasElement,
  updateCanvasElement,
  setAllElementSelected,
  deleteSelectedElement,
  setDraggingElement,
  setSelectedElementID
} = canvasSlice.actions;
export const canvasReducer = canvasSlice.reducer;