import * as messaging from "messaging";
import { settingsStorage } from "settings";

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("[Phone] Companion Socket Open");
};

// Message socket closes
messaging.peerSocket.onclose = () => {
  console.log("[Phone] Companion Socket Closed");
};

// A user changes settings
settingsStorage.onchange = evt => {
  let data = {
    key: evt.key,
    newValue: evt.newValue
  };
  sendVal(data);
};

// Send data to device using Messaging API
function sendVal(data) {
  console.log(`[Phone] Message being sent: ${JSON.stringify(data)}`);
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  }
}

// Message is received
messaging.peerSocket.onmessage = evt => {
  console.log(`[Phone] Message received: ${JSON.stringify(evt.data)}`);

  let event = evt.data.key;

  if (event == "PostActivityData") {
    let data = evt.data.value;

    sendVal({ key: 'LabelPostActivityData', newValue: 'Requesting...' });

    let url = ""
    try { url = JSON.parse(settingsStorage.getItem('URL')).name } catch (err) { }

    fetch(url, { method: "POST", body: JSON.stringify(data) }).then(function (response) {
      sendVal({ key: 'LabelPostActivityData', newValue: 'Post Data' });

      let today = new Date();
      let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      sendVal({ key: 'LabelPostActivityDataResult', newValue: 'Last request completed at ' + time });
    });
  }

  if (event == "PostSensorData") {
    let data = evt.data.value;

    sendVal({ key: 'LabelPostSensorData', newValue: 'Requesting...' });

    let url = ""
    try { url = JSON.parse(settingsStorage.getItem('URL')).name } catch (err) { }

    fetch(url, { method: "POST", body: JSON.stringify(data) }).then(function (response) {
      sendVal({ key: 'LabelPostSensorData', newValue: 'Post Data' });

      let today = new Date();
      let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      sendVal({ key: 'LabelPostSensorDataResult', newValue: 'Last request completed at ' + time });
    });
  }

  if (event == "GetData") {
    sendVal({ key: 'LabelGetData', newValue: 'Requesting...' });

    let url = ""
    try { url = JSON.parse(settingsStorage.getItem('URL')).name } catch (err) { }

    fetch(url, { method: "GET" }).then(function (response) {
      sendVal({ key: 'LabelGetData', newValue: 'Get Data' });

      let today = new Date();
      let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      sendVal({ key: 'LabelGetDataResult', newValue: 'Last request completed at ' + time });
    });
  }
};