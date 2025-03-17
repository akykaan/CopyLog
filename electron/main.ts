import {
  app,
  BrowserWindow,
  globalShortcut,
  clipboard,
  ipcMain,
} from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

app.commandLine.appendSwitch("disable-gpu");

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
    // frame: false,
    // transparent: true,
    alwaysOnTop: false,
  });

  win.webContents.openDevTools();

  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
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
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll(); // Tüm kısayolları temizle
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Uygulama hazır olduğunda kısa yolları kaydet
app.whenReady().then(() => {
  createWindow();

  let lastText = clipboard.readText();

  setInterval(() => {
    const currentText = clipboard.readText();
    if (currentText && currentText !== lastText) {
      lastText = currentText;
      console.log("lastText11:", currentText);
      win?.webContents.send("clipboard-update", currentText);
    }
  }, 250);
});
