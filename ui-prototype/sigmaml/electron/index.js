const { app, BrowserWindow, ipcMain, Menu , shell, dialog} = require("electron");
const Path = require("path");

const os = require('os');
const pty = require('node-pty');
const { cwd } = require("process");
const fs = require("fs");
const {spawn} = require('child_process');
const dirTree = require("directory-tree");


var usershell = os.platform() === "win32" ? "powershell.exe" : "bash";


const isDev = !app.isPackaged;

app.whenReady().then(main)


let projectDir = "";

const isMac = process.platform === 'darwin'




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

    const openDir = async () => {
      return await dialog.showOpenDialog(window, {
          properties: ['openDirectory']
        }).then(result => {
          // console.log(result.canceled)
          return result.filePaths[0];
        }).catch(err => {
        console.log(err)
      })
    }

    const updateDirContents = (directory) => {
      let curTree = dirTree(directory);
      projectDir = directory;
      window.webContents.send(
        'update-project-dir',
        curTree
      )
    }

    const template = [
      // { role: 'appMenu' }
      ...(isMac ? [{
        label: app.name,
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      }] : []),
      // { role: 'fileMenu' }
      {
        label: 'File',
        submenu: [
          isMac ? { role: 'close' } : { role: 'quit' },
          {
            label: "Open Project",
            // click: openDir().then((result) => {window.webContents.send('update-project-dir', result)})
            click: () => {
              openDir().then(
                updateDirContents
              );
            }
          }
        ]
      },
      // { role: 'editMenu' }
      {
        label: 'Edit',
        submenu: [
          // { role: 'undo' },
          // { role: 'redo' },
          // { type: 'separator' },
          // { role: 'cut' },
          // { role: 'copy' },
          // { role: 'paste' },
          // ...(isMac ? [
          //   { role: 'pasteAndMatchStyle' },
          //   { role: 'delete' },
          //   { role: 'selectAll' },
          //   { type: 'separator' },
          //   {
          //     label: 'Speech',
          //     submenu: [
          //       { role: 'startSpeaking' },
          //       { role: 'stopSpeaking' }
          //     ]
          //   }
          // ] : [
          //   { role: 'delete' },
          //   { type: 'separator' },
          //   { role: 'selectAll' }
          // ])
        ]
      },
      // { role: 'viewMenu' }
      
      {
        label: 'View',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { role: 'togglefullscreen' }
        ]
      },
      // { role: 'windowMenu' }
      {
        label: 'Window',
        submenu: [
          { role: 'minimize' },
          { role: 'zoom' },
          ...(isMac ? [
            { type: 'separator' },
            { role: 'front' },
            { type: 'separator' },
            { role: 'window' }
          ] : [
            { role: 'close' }
          ])
        ]
      },
      {
        role: 'help',
        submenu: [
          {
            label: 'Learn More',
            click: async () => {
              await shell.openExternal('https://google.com')
            }
          }
        ]
      }
    ]
    
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    window.loadFile(Path.resolve("./public/index.html"))

    window.on('ready-to-show', window.show)


    var ptyProcess = pty.spawn(usershell, [], {
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
    // FIX?
    ipcMain.on("runPythonScript", (ev, data) => {
      const toWritePath = projectDir + '/model.json';
      // console.log(toWritePath);
      fs.writeFileSync(toWritePath, data, (error) => {
        if (error) throw error;
      });
      
      // TODO: Fix this in the future?
      // TODO: THIS IS BROKEN
      ptyProcess.write('python3 ' + Path.join(app.getAppPath()) + '/src/python_scripts/testscript.py ' + projectDir + '/model.json' + '\n')
    });

    
    ipcMain.on('request-dir-update', (ev, directory) => {
          updateDirContents(directory)
      }
    )

    

    

}