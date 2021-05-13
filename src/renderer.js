const { ipcRenderer } = require("electron");

document.getElementById("quit-button").addEventListener("click", function () {
  ipcRenderer.send("quitapp");
});
