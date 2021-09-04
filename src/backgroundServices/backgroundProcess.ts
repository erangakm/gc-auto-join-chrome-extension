// import s from "@types/chrome";

chrome.runtime.onInstalled.addListener(() => {
  console.log('onInstalled...');
  // create alarm after extension is installed / upgraded
  chrome.alarms.create('refresh', { periodInMinutes: 1 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  console.log(alarm.name); // refresh
  helloWorld();
});

export function helloWorld() {
  // var newURL = "http://stackoverflow.com/";
  // chrome.tabs.create({ url: newURL });
  console.log("Hello, world!");
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message.operation === "refetch_token") {
    chrome.identity.getAuthToken({ interactive: false }, function (token) {
      sendResponse(token);
    });
  }

  if (request.message.operation === "get_auth_token") {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      sendResponse(token);
    });
  }

  if (request.message.operation === "logout") {
    console.log(request.message.token, "TOKEN>>>>>>>")
    var url = 'https://accounts.google.com/o/oauth2/revoke?token=' + request.message.token;
    fetch(url).then(() => {
      console.log("done");
      sendResponse(true);
    })
  }

  if (request.message.operation === "call_calendar") {
    const token = request.message.token;
    chrome.identity.getProfileUserInfo({ accountStatus: chrome.identity.AccountStatus.ANY }, async function (user_info) {
      console.log(user_info, "PROFILE INFO");
      const timeMin = encodeURIComponent("2021-08-27T11:49:00+10:00");
      const timeMax =  encodeURIComponent("2021-08-28T11:49:00+10:00");
      const fetchUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&singleEvents=true&timeMax=${timeMax}`;
      console.log(fetchUrl, "URL>>>>>>>>");
      const fetchOptions = {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
      const response = await (await fetch(fetchUrl, fetchOptions)).json();
      console.log(response, "response>>>>>>>>s>>")
      sendResponse(response.items);
    });
  }

  return true;
});

