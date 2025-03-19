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
import { store } from "../src/store";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;
let panelWindow: BrowserWindow | null;
let sharedState: any = null;


function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
    x: 1000,
    y: 20,
    width: 800,
    height: 600,
    alwaysOnTop: false,
    frame: false,
    transparent: true,
  });

  // win.webContents.openDevTools();

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

// Window control process
ipcMain.on("minimize-window", () => {
  win!.minimize();
});

ipcMain.on("maximize-window", () => {
  if (win!.isMaximized()) {
    win!.unmaximize();
  } else {
    win!.maximize();
  }
});

ipcMain.on("close-window", () => {
  win!.close();
});

function createPanelWindow(mousePosition: Electron.Point) {
  if (panelWindow) {
    panelWindow.setBounds({
      x: mousePosition.x,
      y: mousePosition.y,
      width: 300,
      height: 400,
    });
    panelWindow.focus();
    return;
  }

  panelWindow = new BrowserWindow({
    width: 800,
    height: 600,
    x: mousePosition.x,
    y: mousePosition.y,
    frame: false,
    alwaysOnTop: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  // panelWindow.webContents.openDevTools();

  if (VITE_DEV_SERVER_URL) {
    panelWindow.loadURL(`${VITE_DEV_SERVER_URL}modal`);
  } else {
    panelWindow.loadFile(path.join(RENDERER_DIST, "index.html"), {
      search: "route=/modal",
    });
  }

  panelWindow.on("closed", () => {
    panelWindow = null;
  });

  panelWindow.on("blur", () => {
    panelWindow?.close();
  });
}

ipcMain.on("send-state-to-main", (event, state) => {
  sharedState = state; // State'i sakla
});

ipcMain.handle("get-state-from-main", () => {
  return sharedState;
});


app.disableHardwareAcceleration();
app.commandLine.appendSwitch("enable-webgl");

app.whenReady().then(() => {
  createWindow();
  const gpuStatus = app.getGPUFeatureStatus();
  console.log('GPU Feature Status:', gpuStatus);

  globalShortcut.register("CommandOrControl+B", () => {
    const mousePosition = screen.getCursorScreenPoint();
    createPanelWindow(mousePosition);
  });

  let lastText = clipboard.readText();

  setInterval(() => {
    const currentText = clipboard.readText();
    if (currentText && currentText !== lastText) {
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

ipcMain.handle("get-clipboard-history", async () => {
  const state = store.getState();
  return state.board.items;
});
