
var https = require('https');
var express = require('express');
var fs = require('fs');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

var  TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
var  token = '536284905:AAGuojcrhk0d98-OJC8FjOR0zRrJf2g2z-E';

// Create a bot that uses 'polling' to fetch new updates
var  bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  var  chatId = msg.chat.id;
  var  resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;



  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message');
  getfile(msg.voice.file_id,chatId);

});



function getfile(fileid,chatId) {
  console.log('chatid', chatId);
  console.log('aqui');
  https.get("https://api.telegram.org/bot536284905:AAGuojcrhk0d98-OJC8FjOR0zRrJf2g2z-E/getFile?file_id="+fileid, (res) => {

    res.on('data', (data) => {
      console.log(data);
      var jsonob   = JSON.parse(data);
      var  path =  jsonob.result.file_path;
      bot.sendMessage(chatId, 'Torou');
      //down(path,fileid)

      google(data)


    });

  }).on('error', (e) => {
    console.error(e);
  });

}


function down(path,fileid) {

  var file = fs.createWriteStream(fileid +'.ogg');
  var request = https.get("https://api.telegram.org/file/bot536284905:AAGuojcrhk0d98-OJC8FjOR0zRrJf2g2z-E/"+path, function(response) {
    response.pipe(file);
  });


}


function google(bytes) {

    var payload = {
      config:{
        encoding: "LINEAR16",
        sampleRate: 16000,
        languageCode: "en-US"
      },
      audio: {
        // You may also upload the audio file to Google
        // Cloud Storage and pass the object URL here
        content: bytes
      }
    };

    // Replace XYZ with your Cloud Speech API key
    var response = (
      "https://speech.googleapis.com/v1/speech:recognize?key=AIzaSyB8hzmEAF3qCZVX78zXzbYrJl5anZoDS-s", {
        method: "POST",
        contentType: "application/json",
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
      });

  console.log(response);





}
