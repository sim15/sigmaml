const { app, BrowserWindow, ipcMain } = require("electron");
const Path = require("path");

const os = require('os');
const pty = require('node-pty');
const { cwd } = require("process");
const dialog = require('electron').dialog;
const FileSystem = require("fs");
const {spawn} = require('child_process');

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

    // const finishpath = (p) => {console.log(p)};
    // console.log(dialog.showOpenDialog({ properties: [ 'openFile', 'openDirectory', 'multiSelections' ], finishpath}));
    
    window.loadFile(Path.resolve("./public/index.html"))

    window.on('ready-to-show', window.show)


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
    // FIX
    ipcMain.on("runPythonScript", (ev, data) => {
      FileSystem.writeFile('file.json', data, (error) => {
        if (error) throw error;
      });
      
      // TODO: Fix this in the future.
      ptyProcess.write('python3 ' + Path.join(app.getAppPath()) + '/src/python_scripts/testscript.py \n')
    });

    

    

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