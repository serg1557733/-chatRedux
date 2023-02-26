import {createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedUser: {},
    isNewPrivateMessages: true
}

export const dataReducersSlice = createSlice({
    name: 'dataReducer',
    initialState,
    reducers: {
        selectedUser: (state, action) => {
                state.selectedUser = action.payload  
      },
        isNewPrivateMessages: (state, action) => {
                state.isNewPrivateMessages = action.payload  
      },
    },
  })
  
  // Action creators are generated for each case reducer function

const {actions, reducer} = dataReducersSlice;
const dataReducer = reducer;

export default dataReducer;

export const {
        selectedUser,
        isNewPrivateMessages
        } = actions;
