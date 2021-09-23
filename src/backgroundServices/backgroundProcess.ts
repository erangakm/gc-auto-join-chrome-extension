import { AuthTokens } from "../model/AuthTokens";

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

const CLIENT_ID = encodeURIComponent(process.env.REACT_APP_OAUTH_CLIENT_ID ?? "");
const RESPONSE_TYPE = encodeURIComponent('code');
const REDIRECT_URI = encodeURIComponent('https://mghoimjmeppliamlmihmenbhaipcodap.chromiumapp.org/')
const SCOPE = `${encodeURIComponent("profile")}+${encodeURIComponent("email")}+${encodeURIComponent("https://www.googleapis.com/auth/calendar.events.readonly")}+${encodeURIComponent("https://www.googleapis.com/auth/calendar.readonly")}`
// const STATE = encodeURIComponent('meet' + Math.random().toString(36).substring(2, 15));
const PROMPT = encodeURIComponent('consent');

const authEndpoint = () => {
  const nonce = encodeURIComponent(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&nonce=${nonce}&prompt=${PROMPT}&access_type=offline`;

  console.log(url);

  return url;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message.operation === "login") {
    chrome.identity.launchWebAuthFlow({
      url: authEndpoint(),
      interactive: true
    }, async (redirectUri) => {
      if (chrome.runtime.lastError || redirectUri == null) {
        sendResponse('fail');
      }
      else {
        console.log(redirectUri, "RESPONSE FROM API CALL>>>>>>>>>>");
        const authorizationCode = new URL(redirectUri).searchParams.get("code");
        if (authorizationCode == null) {
          sendResponse('fail')

          return false;
        }

        const options = {
          method: "POST",
          headers: {
            'Content-Type': "application/x-www-form-urlencoded"
          },
          body: `code=${authorizationCode}&redirect_uri=${encodeURIComponent('https://mghoimjmeppliamlmihmenbhaipcodap.chromiumapp.org/')}&client_id=${encodeURIComponent(process.env.REACT_APP_OAUTH_CLIENT_ID ?? "")}&client_secret=${encodeURIComponent(process.env.REACT_APP_OAUTH_CLIENT_SECRET ?? "")}&grant_type=authorization_code`
        }

        const response = await fetch("https://oauth2.googleapis.com/token", options);
        const body = await response.json()
        console.log(body, "RESPONSE>>>>>>>>>");

        const authTokens: AuthTokens = {
          accessToken: body.access_token,
          refreshToken: body.refresh_token,
        }

        chrome.storage.local.set({ authTokens }, () => {
          sendResponse(authTokens)
        })
      }
    })

    return true;
  }

  if (request.message.operation === "validate_token") {
    const token = request.message.token;

    fetch(`https://www.googleapis.com/oauth2/v2/tokeninfo?access_token=${token}`).then((response) => {
      response.json().then((body) => {
        console.log(body, "token validation response here ---> ");
        sendResponse(body.expires_in > 0)
      })
    })
  }

  if (request.message.operation === "logout") {
    chrome.storage.local.remove("authTokens", () => {
      sendResponse(true)
    })
  }


  if (request.message.operation === "refresh_token") {
    const refreshToken = request.message.refreshToken;
    const options = {
      method: "POST",
      headers: {
        'Content-Type': "application/x-www-form-urlencoded"
      },
      body: `client_secret=${encodeURIComponent(process.env.REACT_APP_OAUTH_CLIENT_SECRET ?? "")}&grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${encodeURIComponent(process.env.REACT_APP_OAUTH_CLIENT_ID ?? "")}`
    }

    fetch("https://oauth2.googleapis.com/token", options).then((response) => {
      response.json().then((body) => {
        sendResponse(body.access_token);
      })
    });
  }

  if (request.message.operation === "call_calendar") {
    const token = request.message.token;
    const timeMin = encodeURIComponent("2021-09-22T11:49:00+10:00");
    const timeMax =  encodeURIComponent("2021-09-24T11:49:00+10:00");
    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&singleEvents=true&timeMax=${timeMax}`;
    const options = {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    };
    fetch(url, options).then((response) => {
      response.json().then((body) => {
        console.log(body, "BODY>>>>>>>>>")
        sendResponse(body.items)
      })
    })

    console.log("calling calendar>>>>>>>>>");
  }

  return true;
});


