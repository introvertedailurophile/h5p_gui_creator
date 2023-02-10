const {
  runFindTheWords,
  runDialogcards,
  runFlashcards,
  runMemoryGame,
} = require("./dist/run_content_module.js");
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 720,
    height: 480,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
  mainWindow.webContents.openDevTools();
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.send("did-finish-load");
  });
}

function handleSubmission() {
  ipcMain.on("did-submit-form", (event, argument) => {
    const { title, description, source, content_type } = argument;
    const filepath = `./tests/${path.parse(source).name}`;

    const options = {
      type: "info",
      defaultId: 2,
      title: "Success!",
      message: "H5P files generated successfully!",
      detail: "File saved in H5P Folder",
    };

    if (content_type == "dialogcards") {
      runDialogcards({
        csvfile: filepath + ".csv",
        outputfile: filepath + ".h5p",
        encoding: "utf-8",
        title: title,
        description: description,
        mode: "normal",
      });
      dialog.showMessageBox(null, options);
    } else if (content_type == "findthewords") {
      runFindTheWords({
        csvfile: filepath + ".csv",
        outputfile: filepath + ".h5p",
        encoding: "utf-8",
        title: title,
        description: description,
      });
      dialog.showMessageBox(null, options);
    } else if (content_type == "flashcards") {
      runFlashcards({
        csvfile: filepath + ".csv",
        outputfile: filepath + ".h5p",
        encoding: "utf-8",
        title: title,
        description: description,
      });
      dialog.showMessageBox(null, options);
    } else if (content_type == "memorygame") {
      runMemoryGame({
        csvfile: filepath + ".csv",
        outputfile: filepath + ".h5p",
        encoding: "utf-8",
        title: title,
      });
      dialog.showMessageBox(null, options);
    } else {
      const options = {
        type: "info",
        defaultId: 2,
        title: "Failure!",
        message: "Content type not recognised",
      };
      dialog.showMessageBox(null, options);
      console.log("Content type not recognised");
    }
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();
  handleSubmission();
});

app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
