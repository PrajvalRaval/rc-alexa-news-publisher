const express = require("express");
const axios = require('axios');
const app = express();

require('dotenv').config();

app.use(express.json());

// Environment Variables

const PORT = process.env.PORT || 3000;
const serverurl = process.env.SERVER_URL;
const channelName = process.env.CHANNEL_NAME;

// Title Text

const flashBriefingTitle = 'Rocket Chat Flash Briefing';


// Get Channel Names

const getSourceChannels = async (channelnamei) =>
  await axios
  .get(`${ serverurl }/api/v1/channels.anonymousread?roomName=${ channelnamei }`)
  .then((res) => res.data)
  .then((res) => `${ res.messages[0].msg }`)
  .catch((err) => {
    console.log(err.message);
  });

  const getJSON = async (channelnamei) =>
  await axios
  .get(`${ serverurl }/api/v1/channels.anonymousread?roomName=${ channelnamei }`)
  .then((res) => res.data)
  .then((res) => {

    return responseJSON = {
      uid: res.messages[0]._id,
      updateDate: res.messages[0].ts,
      titleText: flashBriefingTitle,
      mainText: res.messages[0].msg,
      redirectionUrl: `${ serverurl }/channel/${ channelName }`
    };

  })
  .catch((err) => {
    console.log(err.message);
  });

const getMessages = async () =>{

  var channelNamesString = await getSourceChannels(channelName);
  var messagearray = [];
  
  var array = channelNamesString.split("#");

  for(let i = 1; i < array.length; i++){

    console.log(array[i] + i);
    const channel = array[i];
    const lastMessage = await getJSON(channel)
    
    messagearray.push(lastMessage);
 }

  return messagearray;

}

//PING ROUTE

app.get('/ping', (req, res) => {

  console.log('PING Request');

  const pongData = ('{"data":"PONG"}');
  var pong = JSON.parse(pongData);
  return res.status(200).send(pong);

})

//MAIN ROUTE

app.get('/', async (req, res) => {

    console.log('Getting New Data From Rocket Chat Server');

    var message = await getMessages();

    return res.status(200).send(message);
   
});

app.get('/download', (req, res) => {
  const file = __dirname + '/audioFolder/audioFile.mp3';
  res.download(file);
});

app.listen(PORT, '0.0.0.0', function () {
  console.log(`Server Now Listening on Port ${PORT}`);
});