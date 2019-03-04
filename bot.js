// Creating telegram bot and adding twitter interacting


// importing modules
const Telebot = require('telebot');
const twit = require('twit');
const fetch = require('node-fetch');
const fs = require('fs');


// Instantiating Telegram bot with API key provided
const bot = new Telebot('769008318:AAEF3zVVDM91vsv8bgu83VgEfiR-A-Gn6XI');


// Saving Twitter configutaions to a const
const tConfig = {
    consumer_key: 'hTgDirsZf2DGFeN159kUz0GhQ',
    consumer_secret: '4aNf9q7r6GroW1nEgPpyCq6dSmbtKleQs4V2UQe7BfKPn47AtP',
    access_token: '141491522-TV7bdJCxVMzuXlbuUZqGSgeCo2Pkmg39xKYvpUCg',
    access_token_secret: 'FbElSCUFI4V69cpINIIcXsNL5BohbOkhvewgmx3OMsLLc'
}


// Instantiating Twit module with required twitter configurations
const T = new twit(tConfig);


// Twitter Methods Begin

// Method to Post a Twit
sendTwit = (data) => {

}


// Method to get own Timeline
ownTimeline = (msg) => {
    T.get('statuses/home_timeline', {
        count: 15,
        truncated: false,
        tweet_mode: 'extended'
    }, (err, data, response) => {
        data.forEach(element => {
            bot.sendMessage(msg.from.id, element.full_text);
        });
    });
}


// Method to get another users's timeline
userTimeline = (data) => {

}


// Twitter Methods End


//  Metohd to save file on disk from telegram server

async function saveFile(info, msg) {
    const res = fetch(info.fileLink)
    const result = await res;
    const dest = await fs.createWriteStream('./2.jpg');
    const save = await result.body.pipe(dest);
    return new Promise((resolve, reject) => {
        dest.on('finish', resolve)
        dest.on('error', reject)
    })
}





// Telegram Bot Setup starts

// Command for post
bot.on('/post',(msg) => {
    console.log(msg);
    
})


// bot.on('text', (msg) => {
//     // msg.reply.text(msg.text)
//     console.log(msg.from.id);
//     bot.sendMessage(msg.from.id, msg.text);
//     ownTimeline(msg);
// });



bot.on('photo', (msg) => {
    bot.sendPhoto(msg.from.id, "./1.jpg");
    fileinfo =
        bot.getFile(msg.photo[(msg.photo).length - 1].file_id)
        .then(async (info) => {
            await saveFile(info, msg);
            await bot.sendPhoto(msg.from.id, "./2.jpg");
        });
});
bot.start();