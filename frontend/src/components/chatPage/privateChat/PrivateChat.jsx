import { Avatar, Box, Button} from '@mui/material';
import { dateFormat } from '../utils/dateFormat';
import { useSelector } from 'react-redux';   
import { useRef, useEffect, useState} from 'react';
import { scrollToBottom } from '../utils/scrollToBottom';
import { useDispatch } from 'react-redux';
import { editMessage } from '../../../reducers/messageReducer';
import { MessageEditorMenu } from '../MessageEditorMenu.jsx';
import imgBtn from '../../../assets/img/gg.png';
import useSound from 'use-sound';
import { PrivatChatHeader } from './PrivatChatHeader';
import { privateMessage } from '../../../reducers/userDataReducer';
import notifSound from '../../../assets/get.mp3'
import {isNewPrivateMessages} from "../../../reducers/dataReducers";
import { UserInfoButton } from '../generalChat/UserInfoButton';
import { YoutubeMessage } from '../YoutubeMessage';
import { VideoChat } from '../service/audioChat/VideoChat';

//need to fix update wenn message sendet and icon for new private messages

export const PrivateChat = () => {

    const dispatch = useDispatch();
    const socket = useSelector(state => state.getUserSocketReducer.socket)

    const SERVER_URL =process.env.NODE_ENV == "development"? process.env.REACT_APP_SERVER_URL : process.env.REACT_APP_PUBLIC_URL;

    const user = useSelector(state => state.getUserSocketReducer.socketUserData)
    const storeMessageId = useSelector(state => state.messageReducer.messageId)
    const selectedUser = useSelector(state => state.dataReducer.selectedUser)
    const newPrivateMessages = useSelector(state => state.getUserSocketReducer.newPrivateMessages)
    const chatId = useSelector(state => state.userDataReducer.toUser.socketId)

    const [startMessages, setStartMessages] = useState([])   
    let endMessages = useRef(null);
    socket.on('send privat messages', (messages)=> {
        setStartMessages(messages)
    });
  
// bug need to fix****************




    const [isEditing, setIsEditing] = useState(false)   
    const [isEditiedMessage, setIsEditiedMessage] = useState(false) //need to type in the bottom of message after message was edited

    const [play] = useSound(notifSound);
    const regYoutube = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/; //for youtube video



//audio stream test

const usersOnline = useSelector(state => state.getUserSocketReducer.usersOnline);
const toUser = useSelector(state => state.userDataReducer.toUser)

const toUserSocket = usersOnline.find(user => user._id == toUser._id)|| toUser
const fromUserSocket = usersOnline.find(userInSocket => userInSocket._id == user._id)

const videoEl = useRef(null)
const videoElRemote = useRef(null)
const [stream, setStream] = useState(null);
const [error, setError] = useState(null);



const constraints = {audio: true, 
                     video: {width: 480, 
                                heigth:240}
                    }
    
 let userMedia = null;

async function getMedia(constraints) {
   
  
    try {
        userMedia = await navigator.mediaDevices.getUserMedia(constraints);
       
        videoEl.current.srcObject = userMedia;
        
      
    } catch (err) {
      console.log(err)
    }
  }


  //start 
  getMedia(constraints);

  //call
  const peerConnection = new RTCPeerConnection();

  async function phoneTo ()   {
 
   
    userMedia.getTracks().forEach(track => {
        peerConnection.addTrack(track, userMedia)
    })

    const offer = await peerConnection.createOffer();
    peerConnection.setLocalDescription(offer)

    peerConnection.addEventListener('icecandidate', e => {
        const {candidate} = e;
        if (candidate && socket){
            socket.emit('call', {offer, to: toUserSocket.socketId, from:fromUserSocket.socketId}); 
        }
    })


    
   

  }

  const peerConnection2 = new RTCPeerConnection();
 if (socket){  
        socket.on('call', async ({offer, from})=> {

           console.log(offer, from)
           
            
            // userMedia.getTracks().forEach(track => {
            //     peerConnection2.addTrack(track, userMedia)
            // })
            

            await peerConnection2.setRemoteDescription(offer)

            const answer = await peerConnection2.createAnswer();
            peerConnection2.setLocalDescription(answer)
            socket.emit('call-answer', {answer, from: fromUserSocket.socketId, to: from})
            console.log('emit answer')
          

        })

        
           
        socket.on('call-answer', async ({answer, from, to})=> {
            peerConnection2.setRemoteDescription(answer)
            console.log('answer')
        })
            
            // socket.on('Ice-candidate',candidate => {
            
            //     console.log('new call - on ice candidate', candidate)
            //     })

  
    }

    peerConnection.onicecandidate = (e) => {
        console.log('on-ice', e)
        const {candidate} = e
        if(candidate){
            peerConnection.addIceCandidate(candidate)
            socket.emit('Ice-candidate', {candidate, from: fromUserSocket.socketId})
            }
        }

        

           peerConnection2.addEventListener('track', e => {
            videoElRemote.current.srcObject = e.streams[0]
     })

    //   let incommingChanell;

     //peerConnection.ondatachannel =  event => {
    //     incommingChanell = event.channel;
    //     incommingChanell.onopen = () => console.log('open video chanell')
    //}


   


//     })
 // }


   


    // console.log(videoEl.current)
  
   



      







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









    
      useEffect(() => {
        if(startMessages.length > 0){
           setStartMessages([...startMessages, newPrivateMessages]) 
        }
        }, [newPrivateMessages]);


        useEffect(() => {
            if (!isEditing) {
                scrollToBottom((endMessages)) 
            }
    
          }, [startMessages]);
           
    return (  

        <>
       
            <PrivatChatHeader/>


            <Box>
                <video autoPlay playsInline muted ref={videoEl}></video>
                <button onClick={phoneTo}> call</button>
                <video autoPlay playsInline ref={videoElRemote}></video>
            </Box>

                   
              
                <Box className='messageBox'>  

                    {
                    startMessages.map((item, i) =>
                        <div key={i + 1} className={ 
                            (item.fromUser === user._id)? 'message myMessage' :'message'}
                            onClick = {(e) => {
                                if(e.target.closest("div").className.includes('myMessage') && (item.userName === user.userName) && (item.text === e.target.textContent)){
                                    e.currentTarget.className += ' editMessage'  
                                    dispatch(editMessage({socket, editMessage: e.target.textContent, messageId: item._id}))  
                                    setIsEditing(true)
                                    }
                            }}
                            > 
                            {storeMessageId === item._id ? <MessageEditorMenu />: ""} 
                 
                            <div 
                                key={i}
                            
                                className={ 
                                    (item.fromUser === user._id)? 'message myMessage' :'message'}>
                            
                            { 
                            item.text.match(regYoutube) ? <YoutubeMessage item = {item} />: 
                                (item.file && item.fileType && item.fileType.split('/')[0] !== 'image') ? 

                                <div style={{'display': 'flex', 'alignItems': 'center'}} >

                                    <a href={SERVER_URL + '/' +item.file} download> 
                                        <Button
                                            variant="contained" 
                                            component="label"
                                            sx = {{
                                                minWidth: 'auto',
                                                minHeight: '25px',
                                                backgroundImage:'url(' + imgBtn + ')' ,
                                                backgroundPosition: 'center', 
                                                backgroundRepeat: "no-repeat", 
                                                backgroundSize: '15px 20px',
                                                backgroundColor: '#d3d3d3'

                                            }}  
                                        >
                                        </Button>  
                                    </a>
                                    <p style={{'marginLeft': '15px'}}  >{item.text}</p>  
                                </div>
                            : 
                                <p>{item.text}</p>
                            
                            }

                            { 
                                (item.file && item.fileType && item.fileType.split('/')[0] == 'image' ) //need to fix for other type files
                                ? 
                                    <img width={'auto'} style={{'maxWidth': "90%"}} src={ SERVER_URL + '/' + item.file} alt={'error load image'}/>
                                :
                                ''
                            }

                            </div>

                            <div className={ 
                                (item.userName === user.userName)? 'myDate' :'date'}>
                                {dateFormat(item?.createDate)}
                            </div>
                            {isEditiedMessage && <i>Edited</i>}
                            {/* <div className={ 
                                    (item.fromUser === user._id)? 'myDate' :'date'}>
                                    {dateFormat(item).time}
                            </div> */}
                        </div>
                    )}

                    <div ref={endMessages}></div>

            </Box>
        </>      
    )

    
} 