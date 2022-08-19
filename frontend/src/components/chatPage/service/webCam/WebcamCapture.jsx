import {useRef, useState, useCallback} from 'react';
import Webcam from "react-webcam";
import {Button} from '@mui/material';
import { fileMessage } from '../../../../reducers/messageReducer';
import { useDispatch } from 'react-redux';



const WebcamCapture = () => {

    const dispatch = useDispatch();

    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);

    const capture = useCallback(() => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
     // dispatch(fileMessage( imageSrc))
    }, [webcamRef, setImgSrc]);
  
    return (
      <div style={{
        'maxHeight': '350px',
        'maxWidth': '350px',
        'position': 'absolute',
        'top': '10%', 
        "left": '10%',
        'zIndex': 9999,
        
    }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={{
            'maxHeight': '350px',
            'maxWidth': '350px'
        }}
        />
        <Button
                onClick={capture}
                variant="contained" 
                component="label" 
          >
            New photo 
          </Button>          {imgSrc && (
          <>        
          <Button
              variant="contained" 
              component="label"
            
          >
            Send
          </Button>  
          <Button
              variant="contained" 
              component="label" 
          >
            Save avatar
          </Button>
          <img
            src={imgSrc}
            style={{
             'border':'4px solid blue',
             'borderRadius': '10px'
          }}
            
          />

          </>
        )}
      </div>
    );
  };

  export default WebcamCapture;