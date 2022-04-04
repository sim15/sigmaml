const { app, BrowserWindow, ipcMain, Menu , shell, dialog} = require("electron");
const Path = require("path");

const os = require('os');
const pty = require('node-pty');
const { cwd } = require("process");
const fs = require("fs");
const {spawn} = require('child_process');
const dirTree = require("directory-tree");

const ProjectSettings = require("./setting"); 


var usershell = os.platform() === "win32" ? "powershell.exe" : "bash";


const isDev = !app.isPackaged;

app.whenReady().then(main)


// let projectDir = "";

const isMac = process.platform === 'darwin'








function main () {
  const bounds = ProjectSettings.getWindowSettings();


  const window = new BrowserWindow({
      width: bounds[0], height: bounds[1],
      show: false,
      webPreferences: {
          preload: Path.resolve("./electron/preload.js"),
          nodeIntegration: false,
          enableRemoteModule: false,
          contextIsolation: true,
      }
  })

  window.on("resize", () => ProjectSettings.saveBounds(window.getSize()));
  















  
  const updateDirContents = (directory) => {
    let curTree = dirTree(directory);
    ProjectSettings.setProjectDir(curTree)
    // projectDir = directory;
    // window.webContents.send(
    //   'update-project-dir',
    //   curTree
    // )
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

  ipcMain.on('request-dir-update', (ev) => {
        updateDirContents(ProjectSettings.getProjectDir().name)
    }
  )

  ipcMain.on('open-directory', () => {
    // console.log("YES!!");
    openDir().then(
      updateDirContents)
  })

  ipcMain.handle("get-project-directory", async () => {
    return ProjectSettings.getProjectDir();
  })













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
    let projectDir = ProjectSettings.getProjectDir().name;
    const toWritePath = projectDir + '/model.json';
    // console.log(toWritePath);
    fs.writeFileSync(toWritePath, data, (error) => {
      if (error) throw error;
    });
    
    // TODO: Fix this in the future?
    // TODO: THIS IS BROKEN
    ptyProcess.write('python3 ' + Path.join(app.getAppPath()) + '/src/python_scripts/testscript.py ' + projectDir + '/model.json' + '\n')
  });



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



    
  


}