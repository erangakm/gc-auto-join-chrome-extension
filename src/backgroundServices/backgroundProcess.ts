import { getEnvironmentVariable } from "../lib/getEnvironmentVariable";
import { AuthSession } from "../model/AuthSession";
import { getStorageKey, setStorageKey } from "../lib/chromeStorageHandlers";
import { ScheduledEvent } from "../model/ScheduledEvent";

chrome.runtime.onInstalled.addListener(() => {
  console.log('onInstalled...');
  // create alarm after extension is installed / upgraded
  chrome.alarms.create('refresh', { periodInMinutes: 1 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  joinMeetings();
});

export const joinMeetings = async () => {
  const now = new Date();

  console.log( "Ran alarm at ->", now.toLocaleString("en-US", {
    hour12: true,
    hour: "numeric",
    minute: "numeric"
  }));

  const schedule = await getStorageKey<ScheduledEvent[]>("eventSchedule") ?? [];
  schedule.forEach((schedulledEvent) => {
    const timeDifferenceInSeconds = (schedulledEvent.startTime - now.valueOf()) / 1000;
    if (timeDifferenceInSeconds < 60 && timeDifferenceInSeconds > 0) {
      chrome.notifications.create(`notification-${now.valueOf()}`, {
        type: "basic",
        iconUrl: "logo192.png",
        title: "Event about to start",
        message: `You will be joining your hangouts meeting "${schedulledEvent.title}" within a minute`,
        priority: 2
      });
      console.log(`${schedulledEvent.title} starting in ${timeDifferenceInSeconds} seconds`);
      setTimeout(() => {
        console.log("opening link ->", schedulledEvent.link);
        chrome.tabs.create({ url: schedulledEvent.link });
      }, timeDifferenceInSeconds * 1000)
    }
  });
}

const CLIENT_ID = encodeURIComponent(getEnvironmentVariable("REACT_APP_OAUTH_CLIENT_ID"));
const REDIRECT_URI = encodeURIComponent('https://mghoimjmeppliamlmihmenbhaipcodap.chromiumapp.org/')
const SCOPE = `${encodeURIComponent("profile")}+${encodeURIComponent("email")}+${encodeURIComponent("https://www.googleapis.com/auth/calendar.events.readonly")}+${encodeURIComponent("https://www.googleapis.com/auth/calendar.readonly")}`

const authEndpoint = () => {
  const nonce = encodeURIComponent(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&nonce=${nonce}&prompt=consent&access_type=offline`;

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

        const emailRequestResponse = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${body.access_token}`);
        const emailBody = await emailRequestResponse.json();

        const authSession: AuthSession = {
          accessToken: body.access_token,
          refreshToken: body.refresh_token,
          userEmail: emailBody.email,
        }

        await setStorageKey("authSession", authSession);
        sendResponse(authSession)
      }
    })

    return true;
  }

  if (request.message.operation === "validate_token") {
    const token = request.message.token;

    fetch(`https://www.googleapis.com/oauth2/v2/tokeninfo?access_token=${token}`).then((response) => {
      response.json().then((body) => {
        sendResponse(body.expires_in > 0)
      })
    })
  }

  if (request.message.operation === "logout") {
    chrome.storage.local.remove("eventSchedule");
    chrome.storage.local.remove("authSession", () => {
      sendResponse(true)
    });

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
        setStorageKey("authSession", {
          accessToken: body.access_token,
          refreshToken,
        }).then(() => {
          sendResponse(body.access_token);
        });
      })
    });
  }

  return true;
});


