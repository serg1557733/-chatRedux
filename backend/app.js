const express = require('express');
const app = express()
const cors = require("cors");
const http = require('http'); //create new http
const mongoose = require('mongoose');
const socket = require("socket.io");
const User = require('./db/models/User');
const Message = require('./db/models/Message');
const PrivateMessage = require('./db/models/PrivateMessage')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config(); // add dotnv for config
const Uuid = require('uuid'); //lib for unic id generate
const fileupload = require('express-fileupload');
const fs = require('fs');

const ORIGIN_URL = process.env.REACT_APP_BASE_URL

const server = http.createServer(app);
app.use(cors());
app.use(express.json());
app.use(fileupload())
app.use(express.static('avatars')); //folder for static files

const io = require("socket.io")(server, {
    cors: ORIGIN_URL
});
const PORT = process.env.PORT || 5000;
const TOKEN_KEY = process.env.TOKEN_KEY || 'rGH4r@3DKOg06hgj'; 
const HASH_KEY = 7;
const STATIC_PATH = process.env. STATIC_PATH || 'avatars';


const generateToken = (id, userName, isAdmin) => {
    const payload = {
        id,
        userName,
        isAdmin
    }
    return jwt.sign(payload, TOKEN_KEY);
}

const isValidUserName = (userName) => {
    const nameRegex = /[^A-Za-z0-9]/ ;
    return (!nameRegex.test(userName) && userName.trim().length > 2);
}
const getAllDbUsers = async (socket) => {
    const usersDb = await User.find({})
    socket.emit('allDbUsers', usersDb) 
}


const getOneUser = async (userName) => {
    const userInDb = await User.findOne({userName});
    return userInDb;
}
app.post('/login', async (req, res) => {
    try {
        const {userName,password} = req.body;
        if (!isValidUserName(userName)){
            return res.status(400).json({message: 'Invalid username'})
        }
        const dbUser = await getOneUser(userName)

        if (dbUser?.isBanned){
            return res.status(401).json({message: 'Your account has been banned!!!'})
        }
        const hashPassword = await bcrypt.hash(password, HASH_KEY);
        if (!dbUser) {
            const user = new User({
                userName,
                hashPassword,
                isAdmin: !await User.count().exec(),
                isBanned: false,
                isMutted: false, 
                avatar: '',
                messages: []
            });

            await user.save()

            return res.json({
                token: generateToken(user.id, user.userName, user.isAdmin)

            });
        }

        if (dbUser && !bcrypt.compareSync(password, dbUser.hashPassword)){
            return res.status(400).json({message: 'Invalid credantials'})
        }
        res.json({
            token:  generateToken(dbUser.id, dbUser.userName, dbUser.isAdmin),
        })
        

    } catch (e) {
        console.log(e);
        res.status(500).json({message: `Error ${e}`});
    }
})

app.post('/avatar', async (req, res) =>  {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json('No files were uploaded.');
      }
    try {
        const file = req.files.file;
        const user = jwt.verify(req.body.token, TOKEN_KEY);
        const avatarFileName = Uuid.v4() + '.jpeg';
        file.mv(STATIC_PATH + '\/' + avatarFileName)
        const userFromDb = await getOneUser(user.userName);
        if(userFromDb.avatar){
            const oldAvatar = userFromDb.avatar;
            fs.unlinkSync(STATIC_PATH + '\/' + oldAvatar)
        }
        await User.findOneAndUpdate({userName: user.userName},{ $set: {'avatar': avatarFileName}},   {
            new: true
          });
        return res.json({ message:'Avatar was uploud succesfully...', avatarUrl: avatarFileName})
        
    } catch (error) {
        res.status(500).json({message: `Error uppload file to serverp: ${error}`});
    }
    
})

app.post('/files', async (req, res) =>  {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json('No files were uploaded.');
    }  
    
    const user = jwt.verify(req.body.token, TOKEN_KEY);
    const oneUser = await getOneUser(user.userName);
    if(oneUser.isMutted){  
        return;
     }
    const files = req.files.files;
    if (files.length) {
        for (let i = 0; i < files.length; i++) {
        let file = files[i]
        file.mv(STATIC_PATH + '\/' + file.name) 

        const message = new Message({
            text:  file.name,
            userName: user.userName,
            createDate: Date.now(),
            user: oneUser.id, //add link to other collection by id
            file: file.name,
            fileType: file.mimetype
        });

        try {
            await message.save();
            if(!oneUser.messages){
                await oneUser.update({ $set: {'messages': []}});
            }
            await oneUser.messages.push(message)
            await oneUser.save()
        } 
        catch (error) {
            console.log('Message save to db error', error);   
        }
        const newMessages = await message.populate( {path:'user'})   
        io.emit('newmessage', newMessages);        

   }}     
    else {
            if (files.name == 'blob') {
                files.name = Uuid.v4() + '.jpeg'
            }
            files.mv(STATIC_PATH + '\/' + files.name);      //for one file       
            const message = new Message({
                text: files.name,
                userName: user.userName,
                createDate: Date.now(),
                user: oneUser.id, //add link to other collection by id
                file: files.name,
                fileType: files.mimetype
            });
    
            try {
                await message.save();
                if(!oneUser.messages){
                    await oneUser.update({ $set: {'messages': []}});
                }
                await oneUser.messages.push(message)
                await oneUser.save()
            } 
            catch (error) {
                console.log('Message save to db error', error);   
            }
           const newMessages = await message.populate( {path:'user'})  
           io.emit('newmessage', newMessages); 
    } 

    return res.json({ message:'File was uploud succesfully...'})
  })



io.use( async (socket, next) => {
    const token = socket.handshake.auth.token; 
    const sockets = await io.fetchSockets();
    if(!token) {
        console.log('token error - socket disconnect')
        socket.disconnect();
        return;
    }
    
    const usersOnline = [];
    sockets.map(sock => usersOnline.push(sock.user))
   
    try {
        const user = jwt.verify(token, TOKEN_KEY);
        const userName = user.userName;
        const dbUser = await getOneUser(userName);

        if(dbUser && dbUser.isBanned){
            socket.disconnect();
            return;
        }
        socket.user = user;
        const exist = sockets.find(current => current.user.userName == socket.user.userName)

        // console.log('exist ' , exist)

        if(exist) {  //&& !user.isAdmin  - add for two or more admins 
            console.log(exist.user.userName, 'exist twice entering...')   
            exist.disconnect();
        } 
    } catch(e) {
        console.log(e);
        socket.disconnect();
    }
    next();
});

io.on("connection", async (socket) => {
    const userName = socket.user.userName;
    const sockets = await io.fetchSockets();
    const dbUser = await getOneUser(userName);
    const allUsers = await getAllDbUsers(socket) // send allUsers from DB to socket user

    //need to use this ID to socket privat messges

    const usersInSocket = [];
        for (let [id, socket] of io.of("/").sockets) {
            
            const dbUser = await getOneUser(socket.user.userName)
            usersInSocket.push({...dbUser._doc,socketId: id });
        }

// const onUser = []
//     const usersOnlineID = usersOnline.map(users => Object.values(users)[0])
//     const userSet = new Set(usersOnlineID)
//     for (let id of userSet) {
//         const userFromDb = await User.findById(id)
//         onUser.push(userFromDb)
//     }


//tasks 
// find private chats and send to users

// if(socket.user){
//      const siPrivate = await PrivateMessage.find({toUser: socket.user.id})
//      console.log(!!siPrivate)
// }
console.log(usersInSocket.userName)

    io.emit('usersOnline', usersInSocket); // send array online users  

    //send private chats for user

    const privateChats = await PrivateMessage.find( {$or:[ {toUser: dbUser._id}, {fromUser: dbUser._id }],foreignField: '_id'}).populate( ['fromUser','toUser'])//need to optimal way found

    const myChats = []
// privateChats.map((item, i) => {
//     console.log(item)
    
// })
///
// console.log(myChats)
 //console.log(privateChats)

socket.emit('my chats', privateChats)

    socket.emit('connected', dbUser); //socket.user
  
    if(socket.user.isAdmin){
         getAllDbUsers(socket); 
    }//sent all users from db to admin

    const messagesToShow = await Message.find({}).sort({ 'createDate': -1 }).limit(20).populate( {path:'user'});   
    socket.emit('allmessages', messagesToShow.reverse());

    socket.on("message", async (data) => {
        const dateNow = Date.now(); // for correct working latest post 
        const post = await Message.findOne({userName}).sort({ 'createDate': -1 })
        const oneUser = await getOneUser(userName);
        if(oneUser.isMutted){  //(oneUser.isMutted || !post)
            return;
        }

        if(((Date.now() - Date.parse(post?.createDate)) < 1500)){
            console.log((Date.now() - Date.parse(post?.createDate)))// can use to show timer near by button
            return;
        }

        // if(!oneUser.isMutted && post){
        // if(((Date.now() - Date.parse(post.createDate)) > 150)){//change later 15000  
        
        const message = new Message({
                text: data.message,
                userName: userName,
                createDate: Date.now(),
                user: oneUser.id, //add link to other collection by id
            });
            try {
                await message.save();
                if(!oneUser.messages){
                    await oneUser.update({ $set: {'messages': []}});
                }
                await oneUser.messages.push(message)
                await oneUser.save()
            } catch (error) {
                console.log('Message save to db error', error);   
            }
            const newMessages = await message.populate( {path:'user'})   
            io.emit('newmessage', newMessages);        
            // }
        // } 
    });
    
    try {
        socket.on("disconnect", async () => {

            const exist = sockets.find(current => current.user.userName == socket.user.userName)
            const usersOnline = sockets.map(sock => sock.user)
        
            const filteredUsersOnline = usersOnline.filter(user => exist.user.id !== user.id)
        
           
           io.emit('usersOnline', filteredUsersOnline);

            // const sockets = await io.fetchSockets();
            // io.emit('usersOnline', sockets.map(sock => sock.user));
             console.log(`user :${socket.user.userName} , disconnected to socket`); 

        });
            console.log(`user :${socket.user.userName} , connected to socket`); 

        socket.on("muteUser",async (data) => {
            if(!socket.user.isAdmin){
                return;
            }
                // if(socket.user.isAdmin){
                    const {user, prevStatus} = data;
                    const sockets = await io.fetchSockets();
                    const mute = await User.updateOne({userName : user}, {$set: {isMutted :!prevStatus}});
                    getAllDbUsers(socket);
                    const exist = sockets.find( current => current.user.userName == user)
                    const dbUser = await getOneUser(user);
                    
                    if(exist){
                        exist.emit('connected', dbUser);   
                    } 
                // }
           });


        socket.on('privat chat', async (data) => {
            //find user to in Db
            const privateMessagesToUser = await PrivateMessage.find({toUser: {$in:[data.user._id, data.toUser._id]}, fromUser: {$in:[data.user._id, data.toUser._id]}}).sort({ 'createDate': 1 })
          
            //find user from in db
            //compare users and if messages is - send 
            socket.emit('send privat messages', privateMessagesToUser)
            
          })

        socket.on("private message", async ({ fromUser, from, message, toUser , to}) => {
//create message and save to DB            
            const privateMessage = new PrivateMessage({
                text:  message,
                createDate: Date.now(),
                fromUser,
                toUser
            });
            await privateMessage.save()
          //emit event 
          
        const privateMessageSentUser = await User.find({_id: fromUser }) // send from user what messaged
        //const privateMessagesToUser = await PrivateMessage.find({toUser: {$in:[fromUser._id, toUser._id]}, fromUser: {$in:[fromUser._id,toUser._id]}}).sort({ 'createDate': 1 })

            socket.to(to).emit("private", {...privateMessage._doc, sender: privateMessageSentUser });

// fix time start and messages after private 






            //add send messages to myself   socket.emit('send privat messages', privateMessagesToUser)     

            // //send new messages array to user

            // const privateMessagesToUser = await PrivateMessage.find({toUser: {$in:[fromUser._id, toUser._id]}, fromUser: {$in:[fromUser._id, toUser._id]}}).sort({ 'createDate': 1 })

            // socket.emit('send privat messages', {privateMessagesToUser, fromUser})

          });


    

    


        socket.on("banUser",async (data) => {
            if(!socket.user.isAdmin){
                return;
            }

            // if(socket.user.isAdmin) { 
                const {user, prevStatus} = data;
                const sockets = await io.fetchSockets();
                const ban = await User.updateOne({userName : user}, {$set: {isBanned:!prevStatus}});
                getAllDbUsers(socket)
                const exist = sockets.find( current => current.user.userName == user)
                
                if(exist){
                    exist.emit('ban', "dbUser")
                    exist.disconnect();  
                }
            // }
           });

           socket.on('userWriting', async () => {
                let isTyping = true;
                io.emit('writing', {userName, isTyping})
           })

           socket.on('editmessage', async (data) => {
            console.log(data.messageNewText)
            const user = jwt.verify(data.token, TOKEN_KEY)
                if(!user){
                    return
                }
                try {
                    await Message.findByIdAndUpdate(data.messageId, {text:data.messageNewText})
                    const messagesToShow = await Message.find({}).sort({ 'createDate': -1 }).limit(20).populate( {path:'user'});   
                    io.emit('allmessages', messagesToShow.reverse())

                } catch (error) {
                    console.log(error)
                    
                }
               }) 

           socket.on('deleteMessage', async (data) => {
                const user = jwt.verify(data.token, TOKEN_KEY)
                console.log(data.messageId)
                if(!user){
                    return
                }
                try {
                    await Message.findByIdAndDelete(data.messageId)
                    const messagesToShow = await Message.find({}).sort({ 'createDate': -1 }).limit(20).populate( {path:'user'});   
                    io.emit('allmessages', messagesToShow.reverse())

                } catch (error) {
                    console.log(error)
                }
            }) 



    } catch (e) {
        console.log(e);
    }
});

//server and database start
const start = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/chat')
            .then(() => console.log(`DB started`))
        

        // await mongoose
        //     .connect('mongodb+srv://serg1557733:1557733@cluster0.p9ltitx.mongodb.net/?retryWrites=true&w=majority')
        //     .then(() => console.log(`DB started`))

        server.listen(PORT, () => {
            console.log(`Server started. Port: ${PORT}`);
        })
    } catch (e) {
        console.log(e);
    }
}
start();