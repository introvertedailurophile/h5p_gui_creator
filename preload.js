/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
const { contextBridge, ipcRenderer, remote, shell } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  submitform: (title, description, source, content_type) =>
    ipcRenderer.send("did-submit-form", {
      title: title,
      description: description,
      source: source,
      content_type: content_type,
    }),
  onsuccess: () =>
    ipcRenderer.on("processing-did-succeed", (event, html) => {
      shell.openExternal(`file://${html}`);
    }),
  onfailure: () =>
    ipcRenderer.on("processing-did-fail", (event, error) => {
      console.error(error);
      alert("Failed :'(");
    }),
});
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }

  contextBridge.contextBridge;
});
