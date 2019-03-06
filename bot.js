// Creating telegram bot and adding twitter interacting


// importing modules
const Telebot = require('telebot');
const twit = require('twit');
const fetch = require('node-fetch');
const fs = require('fs');


// Instantiating Telegram bot with API key provided
const bot = new Telebot({
    token: '769008318:AAEF3zVVDM91vsv8bgu83VgEfiR-A-Gn6XI',
    usePlugins: ['commandButton', 'askUser']
});


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
sendTwit = (msg) => {
    let id = msg.from.id;
    let replyToMessage = msg.message_id;
    let params = {
        status: `${msg.text}`
    }

    console.log(params.status);
    T.post('statuses/update', params, function (err, data, response) {
        if (data) {
            bot.sendMessage(
                id, "Sent Successfully", {
                    replyToMessage
                }
            );
        }
        if (err) {
            bot.sendMessage(id, "Sorry! error occured", {
                replyToMessage
            })
        }

    })
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
userTimeline = (msg) => {
    bot.sendMessage(msg.from.id, `Tweets from ${msg.text}`);
    T.get('statuses/user_timeline', {
        screen_name: `${msg.text}`,
        count: 10,
        tweet_mode: 'extended'
    }, (err, data, response) => {
        if (data) {
            data.forEach(element => {
                bot.sendMessage(msg.from.id, element.full_text);
            });
        }
        if (err) {
            console.log(err)
        }
    });
}


tweetWithImage = (msg) => {
    // Method post a tweet with media
    let status = msg.caption;
    let id = msg.from.id;
    let replyToMessage = msg.message_id;
    let b64content = fs.readFileSync('./2.jpg', {
        encoding: 'base64'
    })

    console.log("Status:", status);

    if (status == undefined) {
        status = "."

    }

    // first we must post the media to Twitter
    T.post('media/upload', {
        media_data: b64content
    }, function (err, data, response) {
        // now we can assign alt text to the media, for use by screen readers and
        // other text-based presentations and interpreters
        let mediaIdStr = data.media_id_string
        // var altText = "Small flowers in a planter on a sunny balcony, blossoming."
        let meta_params = {
            media_id: mediaIdStr,
            // alt_text: {
            //     text: altText
            // }
        }

        T.post('media/metadata/create', meta_params, function (err, data, response) {
            if (!err) {
                // now we can reference the media and post a tweet (media will attach to the tweet)
                let params = {
                    status: status,
                    media_ids: [mediaIdStr]
                }

                T.post('statuses/update', params, function (err, data, response) {
                    if (data) {
                        bot.sendMessage(
                            id, "Sent Successfully", {
                                replyToMessage
                            }
                        );
                    }
                    if (err) {
                        bot.sendMessage(id, "Sorry! error occured", {
                            replyToMessage
                        })
                    }
                })
            }
        })
    })

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


//  Command  /twitter
bot.on('/twitter', msg => {

    // Inline keyboard markup
    const replyMarkup = bot.inlineKeyboard([
        [
            // First row with command callback button
            bot.inlineButton('Get own timeline', {
                callback: '/getOwn'
            })
        ],
        [
            // Second row with command callback button
            bot.inlineButton('Get user tweets', {
                callback: '/getUser'
            })
        ],
        [
            // Third row with command callback button
            bot.inlineButton('Send Tweet', {
                callback: '/sendTweet'
            })
        ],

        // [
        //     // Second row with regular command button
        //     bot.inlineButton('Regular data button', {
        //         callback: 'get'
        //     })
        // ]
    ]);

    // Send message with keyboard markup
    return bot.sendMessage(msg.from.id, 'Example of command button.', {
        replyMarkup
    });

});


// Command /getOwn
bot.on('/getOwn', msg => {
    return ownTimeline(msg);
});


// Command /getUser
bot.on('/getUser', msg => {
    const id = msg.from.id;
    return bot.sendMessage(id, 'Enter twitter username:', {
        ask: 'username'
    });
});



// Command /status
bot.on('/sendTweet', msg => {
    const id = msg.from.id;
    return bot.sendMessage(id, 'Enter status:', {
        ask: 'status'
    });
});


// Button callback
bot.on('callbackQuery', (msg) => {

    // console.log('callbackQuery data:', msg.data);
    bot.answerCallbackQuery(msg.id);

});

// Addding buttons for Twitter interactivity

// Asking events

// Ask twitter username event
bot.on('ask.username', msg => {

    const id = msg.from.id;
    return userTimeline(msg);

});



// Ask status for twitter event
bot.on('ask.status', (msg, self) => {
    let id = msg.from.id;
    let replyToMessage = msg.message_id;
    let type = self.type;
    let parseMode = 'html';
    // console.log(self);

    if (self.type == "photo") {
        return fileinfo =
            bot.getFile(msg.photo[(msg.photo).length - 1].file_id)
            .then(async (info) => {
                await saveFile(info, msg);
                // await bot.sendPhoto(msg.from.id, "./2.jpg");
                await tweetWithImage(msg);
            });
    } else if (self.type == "text") {
        return sendTwit(msg);
    }
    // return bot.sendMessage(
    //     id, `This is a <b>${ type }</b> message.`, {
    //         replyToMessage,
    //         parseMode
    //     }
    // );

});





// bot.on('photo', (msg) => {
//     bot.sendPhoto(msg.from.id, "./1.jpg");
//     fileinfo =
//         bot.getFile(msg.photo[(msg.photo).length - 1].file_id)
//         .then(async (info) => {
//             await saveFile(info, msg);
//             await botz.sendPhoto(msg.from.id, "./2.jpg");
//         });
// });
bot.start();