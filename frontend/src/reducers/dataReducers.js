import {createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedUser: {}
}

export const dataReducersSlice = createSlice({
    name: 'dataReducer',
    initialState,
    reducers: {
        selectedUser: (state, action) => {
                state.selectedUser = action.payload  
      }
    },
  })
  
const {actions, reducer} = dataReducersSlice;
const dataReducer = reducer;

export default dataReducer;

export const {
        selectedUser
        } = actions;
