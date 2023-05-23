const { contextBridge, ipcRenderer } = require("electron");
const Toastify = require('toastify-js');

contextBridge.exposeInMainWorld("axios", {
  openAI: (message) => ipcRenderer.invoke('axios.openAI', message),
  backend: (method, path, data, token) => ipcRenderer.invoke('axios.backend', method, path, data, token)
});

contextBridge.exposeInMainWorld("Toastify", {
  showToast: (options) => Toastify(options).showToast()
});