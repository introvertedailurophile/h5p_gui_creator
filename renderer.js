// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.45
const { ipcRenderer, remote, shell } = require("electron");
const { dialog } = remote;

const form = document.querySelector("form");

const inputs = {
  content_type: form.querySelector('input[name="content_type"]'),
  title: form.querySelector('input[name="title"]'),
  description: form.querySelector('input[name="description"]'),
};

const buttons = {
  submit: form.querySelector('button[type="submit"]'),
};

ipcRenderer.on("did-finish-load", () => {
  setApplicationMenu();
});

ipcRenderer.on("processing-did-succeed", (event, html) => {
  shell.openExternal(`file://${html}`);
});

ipcRenderer.on("processing-did-fail", (event, error) => {
  console.error(error);
  alert("Failed :'(");
});

buttons.source.addEventListener("click", () => {
  const directory = dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  if (directory) {
    inputs.source.value = directory;
  }
});

form.addEventListener("submit", (event) => {
  ipcRenderer.send("did-submit-form", {
    source: inputs.source.value,
    content_type: inputs.content_type.value,
    title: inputs.title.value,
    description: inputs.description.value,
  });
});
