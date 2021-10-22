import { getEnvironmentVariable } from "../lib/getEnvironmentVariable";
import { AuthSession } from "../model/AuthSession";
import { getStorageKey, setStorageKey } from "../lib/chromeStorageHandlers";
import { ScheduledEvent } from "../model/ScheduledEvent";
import { logEvent } from "./logger";
import { AlarmTypes } from "../model/AlarmTypes";
import { emailRequestEndpoint, extensionUrl, oAuthEndpoint, refreshTokenEndpoint, validateTokenEndpoint } from "../googleEndpoints";

chrome.runtime.onInstalled.addListener(() => {
  console.log('onInstalled...');
  // create alarm after extension is installed / upgraded
  chrome.alarms.create('refresh', { periodInMinutes: 1 });
});

const eventAlarmValidator = (alarmName: string): { eventId: string; alarmType: AlarmTypes } | null => {
  const deconstructed = alarmName.split("--");

  if (deconstructed.length === 3 && deconstructed[0] === "eventSchudule") {
    return {
      eventId: deconstructed[1],
      alarmType: deconstructed[2] as AlarmTypes,
    }
  }

  return null;
}

const findEventInSchedule = async (eventId: string): Promise<ScheduledEvent | null> => {
  const allEvents = await getStorageKey<ScheduledEvent[]>("eventSchedule") ?? [];

  return allEvents.find((event) => event.id === eventId) ?? null;
}

const sendReminder = async (scheduledEvent: ScheduledEvent, alarmType: AlarmTypes) => {
  const now = new Date();

  const title = alarmType === AlarmTypes.OneMinuteReminder ?
    "Meeting about to start" : "Meeting starting now";
  const baseMessage = `You will be joining your video meeting "${scheduledEvent.title}"`;
  const message = alarmType === AlarmTypes.OneMinuteReminder ?
    `${baseMessage} in a minute` : `${baseMessage} now!`;

  chrome.notifications.create(`notification-${now.valueOf()}`, {
    type: "basic",
    iconUrl: "logo.png",
    title,
    message,
    priority: alarmType === AlarmTypes.OneMinuteReminder ? 2 : 1
  })
};

const joinMeeting = (event: ScheduledEvent) => {
  // chrome.tabs.query({}, (tabs) => {
  //   console.log(tabs, "TABLS>>>>>>>>>");
  // })

  chrome.tabs.create({ url: event.link })
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
  console.log( "alarm fired ->", alarm.name, new Date().toLocaleString("en-US", {
    hour12: true,
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  }));

  const schedule = await getStorageKey<ScheduledEvent[]>("eventSchedule");
  console.log("Schedule ->", schedule);

  const eventScheduleAlarm = eventAlarmValidator(alarm.name);
  if (eventScheduleAlarm == null) {
    return;
  }

  const { eventId, alarmType } = eventScheduleAlarm;

  const scheduledEvent = await findEventInSchedule(eventId);
  if (scheduledEvent == null) {
    logEvent(`Event ${eventId} not found in schedule`);

    return;
  }

  switch(eventScheduleAlarm.alarmType) {
    case AlarmTypes.OneMinuteReminder:
    case AlarmTypes.ThreeSecondReminder:
      await sendReminder(scheduledEvent, alarmType);
      break;

    case AlarmTypes.MeetingRedirect:
      joinMeeting(scheduledEvent);
      break;

    default:
      return;
  }
});

const clientId = encodeURIComponent(getEnvironmentVariable("REACT_APP_OAUTH_CLIENT_ID"));
const clientSecret = encodeURIComponent(getEnvironmentVariable("REACT_APP_OAUTH_CLIENT_SECRET"));
const redirectUri = encodeURIComponent(extensionUrl)
const scopes = `${encodeURIComponent("email")}+${encodeURIComponent("https://www.googleapis.com/auth/calendar.events.readonly")}`

const authEndpoint = () => {
  const nonce = encodeURIComponent(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));

  return `${oAuthEndpoint}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}&nonce=${nonce}&prompt=consent&access_type=offline`;
}

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.message.operation === "login") {
    chrome.identity.launchWebAuthFlow({
      url: authEndpoint(),
      interactive: true
    }, async (oauthRedirectUri) => {
      if (chrome.runtime.lastError || oauthRedirectUri == null) {
        sendResponse('fail');
      }
      else {
        const authorizationCode = new URL(oauthRedirectUri).searchParams.get("code");
        if (authorizationCode == null) {
          sendResponse('fail')

          return false;
        }

        const exchangeTokenOptions = {
          method: "POST",
          headers: {
            'Content-Type': "application/x-www-form-urlencoded"
          },
          body: `code=${authorizationCode}&redirect_uri=${redirectUri}&client_id=${clientId}&client_secret=${clientSecret}&grant_type=authorization_code`
        }

        const exchangeTokenResponse = await fetch(refreshTokenEndpoint, exchangeTokenOptions);
        const exchangeTokenBody = await exchangeTokenResponse.json()

        const emailRequestResponse = await fetch(`${emailRequestEndpoint}?access_token=${exchangeTokenBody.access_token}`);
        const emailRequestBody = await emailRequestResponse.json();

        const authSession: AuthSession = {
          accessToken: exchangeTokenBody.access_token,
          refreshToken: exchangeTokenBody.refresh_token,
          userEmail: emailRequestBody.email,
        }

        await setStorageKey("authSession", authSession);
        sendResponse(authSession)
      }
    })

    return true;
  }

  if (request.message.operation === "validate_token") {
    const token = request.message.token;

    fetch(`${validateTokenEndpoint}?access_token=${token}`).then((response) => {
      response.json().then((body) => {
        sendResponse(body.expires_in > 0)
      })
    })
  }

  if (request.message.operation === "logout") {
    chrome.alarms.clearAll();
    chrome.storage.local.remove("eventSchedule");
    chrome.storage.local.remove("authSession", () => {
      sendResponse(true)
    });
  }


  if (request.message.operation === "refresh_token") {
    const refreshToken = request.message.refreshToken;
    const rereshTokenOptions = {
      method: "POST",
      headers: {
        'Content-Type': "application/x-www-form-urlencoded"
      },
      body: `client_secret=${clientSecret}&grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${clientId}`
    }

    fetch(refreshTokenEndpoint, rereshTokenOptions).then((response) => {
      response.json().then((body) => {
        setStorageKey("authSession", {
          accessToken: body.access_token,
          refreshToken,
          userEmail: request.message.userEmail,
        }).then(() => {
          sendResponse(body.access_token);
        });
      })
    });
  }

  return true;
});


