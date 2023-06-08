import { useCallback, useEffect, useRef } from "react";
import useStateWithCallback from "../../../../hooks/useStateWithCallback";
import { useSelector } from "react-redux";

export  function useWebRTC(chatId) {


    const socket = useSelector(state => state.getUserSocketReducer.socket)

    const [users, updateUsers] = useStateWithCallback([])

    const addNewUser = useCallback((newUser, cb) => {
        if(!users.includes(newUser)){
            updateUsers(list => [...list, newUser], cb);
        
        }
    }, [users, updateUsers])

    const peerConnection = useRef({});
    const localMediaStream = useRef(null);
    const peerMediaElements = useRef({});

    useEffect(() => {
        async function startCapture() {
            localMediaStream.current = await navigator.mediaDevices({audio: true, video: {width: 640, heigth:320}
            })
            
            
        }

        startCapture()
            .then(() => socket.emit('audio', chatId))
            .catch(e => console.log('Error geting user media', e))

    }, [chatId])

}