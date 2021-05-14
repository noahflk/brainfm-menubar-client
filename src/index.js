const { app, globalShortcut, ipcMain, BrowserView, systemPreferences } = require("electron");
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

  // Add styling once and then on every reload
  addStylingToWindow(window);

  window.webContents.once("dom-ready", () => {
    addStylingToWindow(window);
  });

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
  globalShortcut.register("MediaNextTrack", skip);
  globalShortcut.register("MediaPlayPause", playPause);

  const view = new BrowserView({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  window.setBrowserView(view);
  view.setBounds({ x: 0, y: 0, height: 40, width: 600 });
  view.setAutoResize({ width: true });
  view.webContents.loadURL("file://" + path.join(__dirname, "index.html"));
  // view.webContents.openDevTools();
});

ipcMain.on("quitapp", () => {
  app.quit();
});

function skip() {
  console.log("Skip track");

  mb.window.webContents.executeJavaScript('document.getElementsByClassName("Skip__skip___yeyZ-")[0].click()');
}

function playPause() {
  console.log("Play/Pause");

  mb.window.webContents.executeJavaScript('document.getElementsByClassName("PlayControl__wrapper___341vD")[0].click()');
}

function addStylingToWindow(window) {
  console.log("Adding custom CSS");
  window.webContents.insertCSS("::-webkit-scrollbar { display: none; }");
  window.webContents.insertCSS("html, #navBarApp { margin-top: 40px !important; }");
}
