const { app, BrowserWindow, ipcMain } = require("electron");
const Path = require("path");

const os = require('os');
const pty = require('node-pty');
const { cwd } = require("process");

var shell = os.platform() === "win32" ? "powershell.exe" : "bash";


const isDev = !app.isPackaged;

app.whenReady().then(main)

function main () {

    const window = new BrowserWindow({
        width: 1920, height: 1080,
        show: false,
        webPreferences: {
            preload: Path.resolve("./electron/preload.js"),
            nodeIntegration: false,
            enableRemoteModule: false,
            contextIsolation: true,
        }
    })

    
    window.loadFile(Path.resolve("./public/index.html"))

    window.on('ready-to-show', window.show)


    // var term = pty.spawn(shell, [], {
    //     name: "xterm-color",
    //     // cols: 80,
    //     // rows: 24,
    //     cwd: process.env.HOME,
    //     env: process.env
    // });

    // let termpid = term.pid;
    // console.log(`Create Terminal : ${termpid}`);

    // term.onData((data) => {
    //     window.webContents.send("terminal.sendData", data);
    // });

    // ipcMain.on("term.data", (ev, data) => {
    //     term.write(data);
    // });

    // ipcMain.on("term.resize", (ev, data) => term.resize(data.cols, data.rows));





    var ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cwd: process.env.HOME,
        // env: process.env
    });

    ptyProcess.on("data", (data) => {
      window.webContents.send("terminal-incData", data);
    });

    ipcMain.on("terminal-into", (event, data)=> {
      ptyProcess.write(data);
    });
    // TODO: temporary fix
    ptyProcess.write(' ');
    ptyProcess.write('\b');

    ipcMain.on("term.resize", (ev, data) => ptyProcess.resize(data.cols, data.rows));

}

// app.whenReady().then(() => {
//     createWindow();

//     app.on("before-quit", () => {
//         term.kill();
//         console.log(`Close Terminal : ${termpid}`);
//     });

//     app.on("window-all-closed", () => {
//         app.quit();
//     });
// });