import { createSlice, nanoid } from '@reduxjs/toolkit';
import { sliceKeys } from '../utils/keys';

// ==============================|| states ||============================== //
const initialState = {
  images: []
};

// ==============================|| slice ||============================== //
export const imageSlice = createSlice({
  name: sliceKeys.image,
  initialState,
  reducers: {
    addImage: (state, action) => {
      const newImage = {
        id: nanoid(),
        width: action.payload.width,
        height: action.payload.height,
        src: action.payload.src,
      };

      state.images.push(newImage);
    },

    deleteImage: (state, action) => {
      state.images = state.images.filter((data) => {
        if (data.id != action.payload) {
          return data;
        }
      });
    },

  }
});

export const {
  addImage,
  deleteImage
} = imageSlice.actions;

export const imageReducer = imageSlice.reducer;