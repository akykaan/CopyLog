import {
  app,
  BrowserWindow,
  globalShortcut,
  clipboard,
  screen,
  ipcMain,
} from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import squirrelStartup from "electron-squirrel-startup";
import {
  isSharedStatePayload,
  MAX_CLIPBOARD_READ_LENGTH,
  SharedStatePayload,
} from "../src/types/ipc";

if (squirrelStartup) {
  app.quit();
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

const webPreferences = {
  preload: path.join(__dirname, "preload.mjs"),
  contextIsolation: true,
  sandbox: true,
  nodeIntegration: false,
  nodeIntegrationInWorker: false,
  webSecurity: true,
};

let win: BrowserWindow | null;
let panelWindow: BrowserWindow | null;
let sharedState: SharedStatePayload | null = null;
let alwaysOnTopEnabled = false;

function denyWindowOpen(contents: Electron.WebContents) {
  contents.setWindowOpenHandler(() => ({ action: "deny" }));
}

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences,
    x: 1000,
    y: 20,
    width: 800,
    height: 600,
    alwaysOnTop: alwaysOnTopEnabled,
    frame: false,
    autoHideMenuBar: true,
    movable: true,
  });

  denyWindowOpen(win.webContents);

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    const filePath = path.join(__dirname, "../dist/index.html");
    win.loadFile(filePath);
  }
}

// Window control process
ipcMain.on("minimize-window", () => {
  if (win) {
    win.minimize();
  }
});

ipcMain.on("maximize-window", () => {
  if (win && win.isMaximized()) {
    win.unmaximize();
  } else if (win) {
    win.maximize();
  }
});

ipcMain.on("close-window", () => {
  if (win) {
    win.close();
  }
});

ipcMain.handle("set-always-on-top", (_event, enabled: unknown) => {
  if (typeof enabled !== "boolean") {
    return false;
  }
  alwaysOnTopEnabled = enabled;
  win?.setAlwaysOnTop(enabled);
  return true;
});

function createPanelWindow(mousePosition: Electron.Point) {
  if (panelWindow) {
    panelWindow.setBounds({
      x: mousePosition.x,
      y: mousePosition.y,
    });
    panelWindow.focus();
    return;
  }

  panelWindow = new BrowserWindow({
    width: 300,
    height: 500,
    x: mousePosition.x,
    y: mousePosition.y,
    frame: false,
    alwaysOnTop: false,
    webPreferences,
  });

  denyWindowOpen(panelWindow.webContents);

  if (VITE_DEV_SERVER_URL) {
    panelWindow.loadURL(`${VITE_DEV_SERVER_URL}#/modal`); // hashRouter
  } else {
    panelWindow.loadFile(path.join(RENDERER_DIST, "index.html"), {
      hash: "#/modal",
    });
  }

  panelWindow.on("closed", () => {
    panelWindow = null;
  });

  panelWindow.on("blur", () => {
    panelWindow?.close();
  });
}

ipcMain.on("send-state-to-main", (_event, state: unknown) => {
  if (isSharedStatePayload(state)) {
    sharedState = state;
  }
});

ipcMain.handle("get-state-from-main", () => {
  return sharedState;
});

app.disableHardwareAcceleration();

app.whenReady().then(() => {
  createWindow();

  globalShortcut.register("CommandOrControl+B", () => {
    const mousePosition = screen.getCursorScreenPoint();
    createPanelWindow(mousePosition);
  });

  let lastText = clipboard.readText();

  setInterval(() => {
    const currentText = clipboard.readText();
    if (
      currentText &&
      currentText.length <= MAX_CLIPBOARD_READ_LENGTH &&
      currentText !== lastText
    ) {
      lastText = currentText;
      win?.webContents.send("clipboard-update", currentText);
    }
  }, 250);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});