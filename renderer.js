// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.45
// const { ipcRenderer, remote, shell } = require("electron");
// const { dialog } = remote;

const form = document.getElementById("form");

const inputs = {
  title: document.getElementById("title"),
  description: document.getElementById("description"),
  source: document.getElementById("source"),
  content_type: document.getElementById("content_type"),
};

const buttons = {
  submit: document.getElementById("submit"),
};

window.electron.onsuccess();
window.electron.onfailure();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  window.electron.submitform(
    inputs.title.value,
    inputs.description.value,
    inputs.source.value,
    inputs.content_type.value
  );
});
