"use strict";

import {
  app,
  protocol,
  BrowserWindow,
  ipcMain,
  shell,
  dialog,
  session,
} from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
import { search, downloadMP3 } from "./loopermanData";
import * as fs from "fs";
import { homedir } from "os";
import { join } from "path";
const isDevelopment = process.env.NODE_ENV !== "production";

let win;

let pref = {
  dir: {
    content: homedir() + "/loopbaseContent",
  },
  theme: "theme-purple",
  compactMode: false,
};

let appdataPath = join(app.getPath("appData"), "loopbase");
let prefsPath = join(appdataPath, "prefs.json");

try {
  if (!fs.existsSync(appdataPath)) fs.mkdirSync(appdataPath);
  if (!fs.existsSync(prefsPath))
    fs.writeFileSync(prefsPath, JSON.stringify(pref));

  pref = JSON.parse(
    fs.readFileSync(prefsPath, { encoding: "utf8", flag: "r" })
  );
} catch {
  alert("Couldn't load preferences!");
}

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    title: "Loopbase",
    icon: join(__static, "icon.png"),
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 21, y: 18 },
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  const filter = {
    urls: ["https://*.looperman.com/*"],
  };

  session.defaultSession.webRequest.onBeforeSendHeaders(
    filter,
    (details, callback) => {
      details.requestHeaders["Referer"] = "https://www.looperman.com/loops";
      callback({ requestHeaders: details.requestHeaders });
    }
  );
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

async function fileExists(path) {
  return new Promise((resolve, reject) => {
    try {
      if (fs.existsSync(path)) resolve(true);
      else resolve(false);
    } catch {
      reject();
    }
  });
}

async function fileDelete(path) {
  return new Promise((resolve, reject) => {
    try {
      fs.unlinkSync(path);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

ipcMain.handle("search", async (event, args) => {
  return await search(args);
});

ipcMain.handle("downloadMP3", async (event, args) => {
  return await downloadMP3(args.url, pref.dir.content + "/" + args.dest);
});

ipcMain.handle("getDir", async (event, dir) => {
  return pref.dir[dir];
});

ipcMain.handle("getVersion", async () => {
  return app.getVersion();
});

ipcMain.handle("fileExists", async (event, path) => {
  return await fileExists(pref.dir.content + "/" + path);
});

ipcMain.handle("fileDelete", async (event, path) => {
  return await fileDelete(pref.dir.content + "/" + path);
});

ipcMain.handle("revealFile", (event, path) => {
  shell.showItemInFolder(pref.dir.content + "/" + path);
});

ipcMain.handle("chooseFile", () => {
  return dialog.showOpenDialog(win, {
    properties: ["openDirectory"],
  });
});

ipcMain.handle("getPrefs", () => {
  return JSON.parse(JSON.stringify(pref));
});

ipcMain.handle("setPrefs", async (event, p) => {
  pref = p;
  return await fs.writeFileSync(prefsPath, JSON.stringify(p));
});

ipcMain.handle("openLink", async (event, url) => {
  shell.openExternal(url);
});

ipcMain.on("ondragstart", (event, filePath) => {
  event.sender.startDrag({
    file: join(pref.dir.content, filePath),
    icon: join(__static, "dragAndDrop.png"),
  });
});
