import { useState, useRef, useCallback, useEffect } from "react"

const useStateWithCallback = initialState => {
    const [state, setState] = useState();
    const cbRef = useRef();

    const updateState = useCallback((newState, cb) => {
        cb.Ref.current = cb    
        setState(prev => typeof newState === 'function' ? newState(prev): newState)

    },[])


    
    useEffect(()=> {
        if (useCallback.current){
            cbRef.current(state);
            cbRef.current = null

        }
    }, [state])

    return [state, updateState];

}

export default useStateWithCallback;