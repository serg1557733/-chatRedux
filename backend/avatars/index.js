import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const functions = require('firebase-functions');


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqJj50pTiXBAtRgTVlNY5AQCBySgGSHqY",
  authDomain: "telegrambot-5f3ce.firebaseapp.com",
  projectId: "telegrambot-5f3ce",
  storageBucket: "telegrambot-5f3ce.appspot.com",
  messagingSenderId: "39238727150",
  appId: "1:39238727150:web:dbe83ac0c806527c7b0aff",
  measurementId: "G-9H7RKXYBD1"
};

// Initialize Firebase
const appFire = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


const  { Telegraf } = require('telegraf');
const express = require('express')

const token = '5717084656:AAET0Vzk61yjkhEO18yltR1GhvkDYtheZdg'

const bot = new Telegraf(token, {polling: true})

const app = express()
const port = 3030

const  RegExpLink = /(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi;
const idForBan = [];

bot.on('message', async (ctx) => {
    console.log(ctx.message.from)


  if(ctx.message.text) {
    const str = ctx.message.text.toLowerCase();
    console.log(str)

    if(str.includes('iptv')){
        ctx.reply(`Message from ${ctx.update.message.from.first_name} edited by BOT
         ${str.replaceAll('iptv', '****')}`)
        ctx.deleteMessage(ctx.message.message_id)
        return

    }

    
    if(str.includes('шаринг')){
        ctx.reply(`Message from ${ctx.update.message.from.first_name} edited by BOT
         ${str.replaceAll('шаринг', '****')}`)
        ctx.deleteMessage(ctx.message.message_id)
        return

    }




    if(str.includes('playlist')){
        ctx.reply(`Message from ${ctx.update.message.from.first_name} edited by BOT
         ${str.replaceAll('playlist', '****')}`)
        ctx.deleteMessage(ctx.message.message_id)

    }


    if(RegExpLink.test(str) && (ctx.message.from.id !== 432003706)){
        console.log(ctx.message.from)
        ctx.reply(`Message from ${ctx.update.message.from.first_name} edited by BOT
        ${ctx.message.text.replace(RegExpLink, 'http****.***')}`)
       

        if(idForBan.includes(ctx.message.from.id)){
            bot.telegram.banChatMember(ctx.message.chat.id, ctx.message.from.id)

        }

        idForBan.push(ctx.message.from.id)
        ctx.deleteMessage(ctx.message.message_id)
        return

     }
  }



   if(ctx.message.document){
      const isPlaylist = ctx.message.document.file_name.includes('.m3u')
      if (isPlaylist){
        ctx.reply(`Hello ${ctx.update.message.from.first_name} playlists banned in this group `)
        ctx.deleteMessage(ctx.message.message_id)
      }
   } 
  })

  console.log(idForBan)

bot.launch()


app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

exports.bot = functions.https.onRequest(app);
