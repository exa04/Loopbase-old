const {ipcRenderer, contextBridge} = require('electron');

contextBridge.exposeInMainWorld("ipcRenderer",ipcRenderer);

contextBridge.exposeInMainWorld('electron', {
    startDrag: (fileName) => {
        ipcRenderer.send('ondragstart', fileName)
    }
})