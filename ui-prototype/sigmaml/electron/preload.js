const { contextBridge, ipcRenderer } = require("electron");

// only difference between ipcRenderer and ipcMain is what they communicate with (main or render processes)

const API = {
    sendMsg: (msg) => ipcRenderer.send('message', msg),
    onCount: (callback) => ipcRenderer.on("count", (event, args) => {
        callback(args);
    }),
    // invoke is different from send, as it requires a return value (we have to listen to promise-msg event)
    sendPromise: (msg) => ipcRenderer.invoke("promise-msg", msg)
}


contextBridge.exposeInMainWorld("myApi", API)