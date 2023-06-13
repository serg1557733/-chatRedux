
//audio stream test

// const usersOnline = useSelector(state => state.getUserSocketReducer.usersOnline);
// const toUser = useSelector(state => state.userDataReducer.toUser)

// const toUserSocket = usersOnline.find(user => user._id == toUser._id)|| toUser
// const fromUserSocket = usersOnline.find(userInSocket => userInSocket._id == user._id)

// const videoEl = useRef(null)
// const videoElRemote = useRef(null)
// const [stream, setStream] = useState(null);
// const [error, setError] = useState(null);



// const constraints = {audio: true, 
//                      video: {width: 480, 
//                                 heigth:240}
//                     }
    
//  let userMedia = null;

// async function getMedia(constraints) {
   
  
//     try {
//         userMedia = await navigator.mediaDevices.getUserMedia(constraints);
       
//         videoEl.current.srcObject = userMedia;
        
      
//     } catch (err) {
//       console.log(err)
//     }
//   }


//   //start 
//   getMedia(constraints);

//   //call
//   const peerConnection = new RTCPeerConnection();

//   async function phoneTo ()   {
 
   
//     userMedia.getTracks().forEach(track => {
//         peerConnection.addTrack(track, userMedia)
//     })

//     const offer = await peerConnection.createOffer();
//     peerConnection.setLocalDescription(offer)

//     peerConnection.addEventListener('icecandidate', e => {
//         const {candidate} = e;
//         if (candidate && socket){
//             socket.emit('call', {offer, to: toUserSocket.socketId, from:fromUserSocket.socketId}); 
//         }
//     })


    
   

//   }

//   const peerConnection2 = new RTCPeerConnection();
//  if (socket){  
//         socket.on('call', async ({offer, from})=> {

//            console.log(offer, from)
           
            
//             // userMedia.getTracks().forEach(track => {
//             //     peerConnection2.addTrack(track, userMedia)
//             // })
            

//             await peerConnection2.setRemoteDescription(offer)

//             const answer = await peerConnection2.createAnswer();
//             peerConnection2.setLocalDescription(answer)
//             socket.emit('call-answer', {answer, from: fromUserSocket.socketId, to: from})
//             console.log('emit answer')
          

//         })

        
           
//         socket.on('call-answer', async ({answer, from, to})=> {
//             peerConnection2.setRemoteDescription(answer)
//             console.log('answer')
//         })
            
//             // socket.on('Ice-candidate',candidate => {
            
//             //     console.log('new call - on ice candidate', candidate)
//             //     })

  
//     }

//     peerConnection.onicecandidate = (e) => {
//         console.log('on-ice', e)
//         const {candidate} = e
//         if(candidate){
//             peerConnection.addIceCandidate(candidate)
//             socket.emit('Ice-candidate', {candidate, from: fromUserSocket.socketId})
//             }
//         }

        

//            peerConnection2.addEventListener('track', e => {
//             videoElRemote.current.srcObject = e.streams[0]
//      })




   
//  <Box>
//  <video autoPlay playsInline muted ref={videoEl}></video>
//  <button onClick={phoneTo}> call</button>
//  <video autoPlay playsInline ref={videoElRemote}></video>
// </Box>


//     // console.log(videoEl.current)
  
   



      







//const freeice = require('freeice');
//const quickconnect = require('rtc-quickconnect');
// initialise a configuration for one stun server

// const qcOpts = {
//   room: 'icetest',
//   iceServers: freeice()
// };
 
// go ahead and connect
// quickconnect('http://rtc.io/switchboard', qcOpts)
//  .createDataChannel('chat')
//   .once('channel:opened:chat', function(peerId, dc) {
//     console.log('data channel opened for peer id: ' + peerId);
 
//     dc.onmessage = function(evt) {
//       console.log('peer ' + peerId + ' says: ' + evt.data);
//     };
 
//     dc.send('hi');
//   });

//end audio***********








