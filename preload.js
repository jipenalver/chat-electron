const { contextBridge, ipcRenderer } = require("electron");
const Toastify = require('toastify-js');

contextBridge.exposeInMainWorld("axios", {
  openAI: (conversation) => ipcRenderer.invoke('axios.openAI', conversation),
  backend: (...args) => ipcRenderer.invoke('axios.backend', ...args)
});

contextBridge.exposeInMainWorld("Toastify", {
  showToast: (options) => Toastify(options).showToast()
});