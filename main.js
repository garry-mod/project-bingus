const { app, BrowserWindow, session } = require('electron');
const path = require('path');

app.disableHardwareAcceleration();

const BLOCKED_DOMAINS = [
  'doubleclick.net',
  'googlesyndication.com',
  'googleadservices.com',
  'adservice.google.com',
  'ads.yahoo.com',
  'adnxs.com',
  'facebook.com/tr',
  'amazon-adsystem.com',
  'scorecardresearch.com',
];

app.whenReady().then(() => {
  session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
    const isAd = BLOCKED_DOMAINS.some((domain) => details.url.includes(domain));
    callback({ cancel: isAd });
  });

  const win = new BrowserWindow({
    fullscreen: true,
    frame: false,
    backgroundColor: '#0b0d12',
    webPreferences: {
      webviewTag: true,
    },
  });

  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});