import { react } from "@vitejs/plugin-react";
import { app, BrowserWindow, globalShortcut, clipboard } from "electron";
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

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
    // autoHideMenuBar: true,
    // alwaysOnTop: true,
    x: 1100, // Ekranın sol üst köşesine yerleştir
    y: 0,
    width: 800, // Pencere genişliği (örneğin 800px)
    height: 600, // Pencere yüksekliği (örneğin 600px)
    frame: false, // Pencere çerçevesini gizle
    roundedCorners: true, // Yuvarlatılmış köşeleri etkinleştir
    transparent: true, // Pencereyi saydam yap
  });
  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
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
