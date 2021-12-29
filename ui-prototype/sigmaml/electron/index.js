const { app, BrowserWindow, ipcMain } = require("electron");
const { join } = require("path");
// const path = require("path");
// const fs = require("fs");
// const os = require("os");
// const pty = require("node-pty");

// var shell = os.platform() === "win32" ? "powershell.exe" : "bash";

const isDev = !app.isPackaged;

app.whenReady().then(main)

function main () {

    const window = new BrowserWindow({
        width: 1200, height: 900,
        show: false,
        webPreferences: {
            preload: join(__dirname, "./preload.js"),
            nodeIntegration: false
        }
    })

    
    window.loadFile(join(__dirname, "../public/index.html"))

    window.on('ready-to-show', window.show)

    // var ptyProcess = pty.spawn(shell, [], {
    //     name: "xterm-color",
    //     cols: 80,
    //     rows: 24,
    //     cwd: process.env.HOME,
    //     env: process.env
    // });

    // ptyProcess.on("data", (data) => {
    //     window.webContents.send("terminal.incData", data);
    // });

    // ipcMain.on("terminal.toTerm", (event, data) => {
    //     ptyProcess.write(data);
    // });

}

if (isDev) {
    require('electron-reload')(__dirname, {
        electron: join(__dirname, '../node_modules/.bin/electron')
    })
}