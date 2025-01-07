const { app, BrowserWindow } = require("electron");
let mainWindow = null;

if(require("electron-squirrel-startup")) app.quit();

app.on("ready", () => 
    {
        mainWindow = new BrowserWindow({webPreferences: { nodeIntegration: true } }); 
        mainWindow.loadFile(__dirname + "/index.html");
    });