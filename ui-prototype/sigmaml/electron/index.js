const { app, BrowserWindow, ipcMain } = require("electron");
const { join } = require("path");

const isDev = !app.isPackaged;

app.whenReady().then(main)

function main () {

    const window = new BrowserWindow({
        width: 1200, height: 900,
        show: false,
        webPreferences: {
            preload: join(__dirname, "./preload.js")
        }
    })

    
    window.loadFile(join(__dirname, "../public/index.html"))

    window.on('ready-to-show', window.show)

    let count = 0;
    setInterval(() => {
        window.webContents.send("count", count++)
    }, 1000)
    

}

if (isDev) {
    require('electron-reload')(__dirname, {
        electron: join(__dirname, '../node_modules/.bin/electron')
    })
}

// from render to main
ipcMain.on("message", (event, args) => {
    console.log(args);
});

ipcMain.handle("promise-msg", async (event, args) => {
    console.log(args)
    return process.getCPUUsage()
})