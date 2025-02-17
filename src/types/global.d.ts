export interface ElectronAPI {
  on: (channel: string, listener: (...args: unknown[]) => void) => void;
  off: (channel: string, listener: (...args: unknown[]) => void) => void;
  send: (channel: string, ...args: unknown[]) => void;
  invoke: (channel: string, ...args: unknown[]) => Promise<unknown>;
  onClipboardUpdate: (callback: (text: string) => void) => void;
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;
}

declare global {
  interface Window {
    electron?: ElectronAPI;
  }
}
