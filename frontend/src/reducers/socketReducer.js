const initialState = {
    socket: null
  }
  
const socketReducer = (state = initialState, action) => {
    switch (action.type){
    case 'SET_SOCKET':  
        return {...state, 
            socket:
              action.socket
            };
    case 'REMOVE_SOCKET':  
        return {...state, 
            socket: 
              initialState.socket
            };
    default:
      return state
    }
  };

 export default socketReducer;