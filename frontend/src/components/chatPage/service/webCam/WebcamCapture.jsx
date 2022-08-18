import WebcamComponent from "./WebcamComponent";
import {useRef, useState, useCallback} from 'react';


const WebcamCapture = () => {

    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    console.log(webcamRef)

    const capture = useCallback(() => {

  
     // const imageSrc = webcamRef.current.getScreenshot();
      //setImgSrc(imageSrc);
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
        <WebcamComponent
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
        />
        <button onClick={capture}>Capture photo</button>
        {imgSrc && (
          <img
            src={imgSrc}
          />
        )}
      </div>
    );
  };

  export default WebcamCapture;