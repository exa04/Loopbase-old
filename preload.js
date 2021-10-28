const {ipcRenderer, contextBridge} = require('electron');
const path = require('path')

contextBridge.exposeInMainWorld("ipcRenderer",ipcRenderer);

contextBridge.exposeInMainWorld('electron', {
  startDrag: (fileName) => {
    ipcRenderer.send('ondragstart', fileName)
  }
})