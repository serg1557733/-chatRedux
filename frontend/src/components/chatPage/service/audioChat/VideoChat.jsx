import { useWebRTC } from "./useWebRTC"
import { useSelector } from "react-redux"

export const VideoChat = (chatId)=> {


    const socket = useSelector(state => state.getUserSocketReducer.socket)

    const peerConnection = new RTCPeerConnection();
    const dataChanell = peerConnection.createDataChannel('video_chat');
    dataChanell.onicecandidate = e => console.log(peerConnection.localDescription);
    const offer =  peerConnection.createOffer();

    peerConnection.setLocalDescription(offer)

    async function startCapture() {
        const localMediaStream = await navigator.mediaDevices({audio: true, video: {width: 640, heigth:320}
        })
        
        
    }

    startCapture()
        .then(() => socket.emit('audio', chatId))
        .catch(e => console.log('Error geting user media', e))



    return (
        <div>
            <video src=""
            autoPlay
            playsInline
            muted={chatId === 'LOCAL_VIDEO'} //muted my own audio need to fix
            >

            </video>
        </div>
    )
}