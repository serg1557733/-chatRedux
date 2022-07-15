// import { isValidPayload } from './validations/isValidPayload';
// import { isValidUserName } from './validations/isValidUserName';
// import { sendForm } from './sendForm';


// export const handleSubmit = async (e, userName , password) => {
//     console.log(userName,password)
//     const POST_URL =  process.env.REACT_APP_POST_URL || 'http://localhost:5000/login';//add on handlesubmit
//     e.preventDefault();

//     if(isValidPayload(userName,password) && isValidUserName(userName)){
//         const data = await sendForm(POST_URL, userName, password);
//         const token = data.token;
//        if(token){
//            localStorage.setItem('token', token); 
//           // dispatch(storeToken(token))
//        }
//         // setTextModal(data.message)
//         // setDisplay('block')
       
//         console.log(userName,password)
//    } 
// //    else {
// //       //  setTextModal('too short or using special symbols')
// //        // setDisplay('block')
// //     }   
// }