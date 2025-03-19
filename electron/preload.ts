import electron from "electron";

const allowedChannels = ["clipboard-update"];

electron.contextBridge.exposeInMainWorld("electron", {
  on(channel: string, listener: (...args: unknown[]) => void) {
    if (allowedChannels.includes(channel)) {
      electron.ipcRenderer.on(channel, (event, ...args) =>
        listener(event, ...args)
      );
    }
  },
  off(channel: string, listener: (...args: unknown[]) => void) {
    if (allowedChannels.includes(channel)) {
      electron.ipcRenderer.off(channel, listener);
    }
  },
  send(channel: string, ...args: unknown[]) {
    if (allowedChannels.includes(channel)) {
      electron.ipcRenderer.send(channel, ...args);
    }
  },
  invoke(channel: string, ...args: unknown[]) {
    if (allowedChannels.includes(channel)) {
      return electron.ipcRenderer.invoke(channel, ...args);
    }
    return Promise.reject(new Error(`Channel "${channel}" is not allowed`));
  },
  onClipboardUpdate: (callback: (text: string) => void) => {
    electron.ipcRenderer.on("clipboard-update", (_, text) => {
      callback(text);
    });
  },
  minimizeWindow: () => electron.ipcRenderer.send("minimize-window"),
  maximizeWindow: () => electron.ipcRenderer.send("maximize-window"),
  closeWindow: () => electron.ipcRenderer.send("close-window"),

  getClipboardHistory: () =>
    electron.ipcRenderer.invoke("get-clipboard-history"),

  sendStateToMain: (state: any) =>
    electron.ipcRenderer.send("send-state-to-main", state),
  getStateFromMain: () => electron.ipcRenderer.invoke("get-state-from-main"),
});
