import { react } from "@vitejs/plugin-react";
import {
  app,
  BrowserWindow,
  globalShortcut,
  clipboard,
  Menu,
  ipcMain,
} from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
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
    alwaysOnTop: true,
  });

  // win.setBackgroundColor("transparent")

  // const menu = Menu.buildFromTemplate([
  //   {
  //     label: "Edit",
  //     submenu: [
  //       {
  //         label: "Always On Top",
  //         type: "checkbox",
  //         click: (menuItem, browserWindow) => {
  //           if (browserWindow) {
  //             console.log(browserWindow.isAlwaysOnTop());
  //             const isAlwaysOnTop = !browserWindow.isAlwaysOnTop();
  //             browserWindow.setAlwaysOnTop(isAlwaysOnTop);
  //             menuItem.checked = isAlwaysOnTop;
  //           }
  //         },
  //       },
  //     ],
  //   },
  // ]);

  // win.setMenu(menu);

  // Test active push message to Renderer-process.
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
