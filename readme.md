# Telegram Bot interacting with Twitter

## Created using nodejs

### API Used
- [twit](https://www.npmjs.com/package/twit) for twitter
- [telebot](https://www.npmjs.com/package/telebot) for telegram

## Requirement
### Software

- nodejs 

### API key and secret Requirement
- for interaction with twitter
    - API key
    - API secret key
    - Access token
    - Access token secret
    - (link to create app and get these keys)[https://developer.twitter.com/en/apps]

- for interaction with telegram bot
    - bot token
    - [link that describes how to get bot token](https://core.telegram.org/bots#creating-a-new-bot)


### Functions can perform:

- get own twitter timeline
- get other user timeline using their username (without @ symbol)
- send tweet
    - without pic: just send text after selection options
    - with picture:
        - select picture and add text in the caption of picture and send

### How to use:

- clone or download repository
- go into the directory
- use `npm install` to install required module
- set required API key, API secret, and bot token in app.js file
- use `node app.js` to start the bot
- go to telegram app and select your bot, send `/twitter` to get  available commands

