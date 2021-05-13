const { app, globalShortcut, systemPreferences } = require("electron");
const { menubar } = require("menubar");
const path = require("path");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const mb = menubar({
  index: "https://www.brain.fm/",
  preloadWindow: true,
  browserWindow: {
    width: 600,
    height: 700,
  },
  showOnRightClick: true,
  icon: app.getAppPath() + "/assets/IconTemplate.png",
});

mb.on("ready", () => {
  const { window } = mb;
  console.log("Application is ready");

  // mb.window.webContents.openDevTools();

  window.webContents.insertCSS("::-webkit-scrollbar { display: none; }");

  window.on("app-command", function (e, cmd) {
    if (cmd === "browser-backward" && window.webContents.canGoBack()) {
      window.webContents.goBack();
    } else if (cmd === "browser-forward" && window.webContents.canGoForward()) {
      window.webContents.goForward();
    }
  });

  // Ask for accessibility permissions
  systemPreferences.isTrustedAccessibilityClient(true);

  // Application must be a trusted accessibility client
  globalShortcut.register("CommandOrControl+X", skip);
  globalShortcut.register("MediaPlayPause", playPause);
});

function skip() {
  console.log("Skip track");

  mainWindow.webContents.executeJavaScript('document.getElementsByClassName("Skip__skip___yeyZ-")[0].click()');
}

function playPause() {
  console.log("Play/Pause");

  mainWindow.webContents.executeJavaScript(
    'document.getElementsByClassName("PlayControl__wrapper___341vD")[0].click()'
  );
}
