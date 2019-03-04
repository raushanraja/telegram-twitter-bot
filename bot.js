const Telebot = require('telebot');
const twit = require('twit');
const fetch = require('node-fetch');
const fs = require('fs');
const bot = new Telebot('769008318:AAEF3zVVDM91vsv8bgu83VgEfiR-A-Gn6XI');
const tConfig = {
    consumer_key: 'hTgDirsZf2DGFeN159kUz0GhQ',
    consumer_secret: '4aNf9q7r6GroW1nEgPpyCq6dSmbtKleQs4V2UQe7BfKPn47AtP',
    access_token: '141491522-TV7bdJCxVMzuXlbuUZqGSgeCo2Pkmg39xKYvpUCg',
    access_token_secret: 'FbElSCUFI4V69cpINIIcXsNL5BohbOkhvewgmx3OMsLLc'
}
const T =new twit(tConfig);


bot.on('text', (msg) => {
    // msg.reply.text(msg.text)
    console.log(msg.from.id);
    bot.sendMessage(msg.from.id, msg.text);
    T.get('statuses/home_timeline',{count:15,truncated:false,tweet_mode:'extended'},(err,data,response) => {
        data.forEach(element => {
            // console.log(element);
        bot.sendMessage(msg.from.id, element.full_text);
            
        });
    });
});


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

bot.on('photo', (msg) => {
    bot.sendPhoto(msg.from.id, "./1.jpg");
    fileinfo =
        bot.getFile(msg.photo[(msg.photo).length - 1].file_id)
        .then(async (info) => {
            await saveFile(info, msg);
            await bot.sendPhoto(msg.from.id, "./2.jpg");
        })

})
bot.start();