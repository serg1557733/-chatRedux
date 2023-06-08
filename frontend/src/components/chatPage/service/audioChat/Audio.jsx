

export const Audio = ()=> {
   
    const getMedia = ()=>{
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
        
                console.log(stream)
         
            });       
        }
}