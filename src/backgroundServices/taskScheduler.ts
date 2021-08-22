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
