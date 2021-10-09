import { getEnvironmentVariable } from "../lib/getEnvironmentVariable";
import { AuthSession } from "../model/AuthSession";
import { getStorageKey, setStorageKey } from "../lib/chromeStorageHandlers";
import { ScheduledEvent } from "../model/ScheduledEvent";
import { logEvent } from "./logger";
import { AlarmTypes } from "../model/AlarmTypes";

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
    "Event about to start" : "Event starting now";
  const baseMessage = `You will be joining your hangouts meeting "${scheduledEvent.title}"`;
  const message = alarmType === AlarmTypes.OneMinuteReminder ?
    `${baseMessage} in a minute` : `${baseMessage} NOW!`

  chrome.notifications.create(`notification-${now.valueOf()}-1`, {
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
  console.log(schedule, "SCHEDULE>>>>>>>.");

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
    chrome.alarms.clearAll();
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
          userEmail: request.message.userEmail,
        }).then(() => {
          sendResponse(body.access_token);
        });
      })
    });
  }

  return true;
});


