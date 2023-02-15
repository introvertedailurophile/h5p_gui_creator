const {
  runFindTheWords,
  runDialogcards,
  runFlashcards,
  runMemoryGame,
} = require("./dist/run_content_module.js");
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
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
  //   mainWindow.webContents.openDevTools();
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.send("did-finish-load");
  });
}

function handleSubmission() {
  ipcMain.on("did-submit-form", (event, argument) => {
     event.preventDefault();
     
    // Receive arguments passed into form
    const { title, description, source, content_type } = argument;
    const filepath = `${__dirname}\\CSV\\${path.parse(source).name}.csv`;
     const dir = `${__dirname}\\H5P`;
     console.log(path.parse(source))

    // Check if H5P folder exists, make new folder
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const output_filepath = `${__dirname}\\H5P\\${path.parse(source).name}.h5p`;
    const success_options = {
      type: "info",
      defaultId: 2,
      title: "Success!",
      message: "H5P files generated successfully!",
      detail: `This is the file path ${output_filepath}`,
    };

    try {
      //  Check content type, run relevant function
      if (content_type == "dialogcards") {
        runDialogcards({
          csvfile: filepath,
          outputfile: output_filepath,
          encoding: "utf-8",
          title: title,
          description: description,
          mode: "normal",
        });
        dialog.showMessageBox(null, success_options);
      } else if (content_type == "findthewords") {
        runFindTheWords({
          csvfile: filepath,
          outputfile: output_filepath,
          encoding: "utf-8",
          title: title,
          description: description,
        });
        dialog.showMessageBox(null, success_options);
      } else if (content_type == "flashcards") {
        runFlashcards({
          csvfile: filepath,
          outputfile: output_filepath,
          encoding: "utf-8",
          title: title,
          description: description,
        });
        dialog.showMessageBox(null, success_options);
      } else if (content_type == "memorygame") {
        runMemoryGame({
          csvfile: filepath,
          outputfile: output_filepath,
          encoding: "utf-8",
          title: title,
        });
        dialog.showMessageBox(null, success_options);
      }
    } catch (error) {
      const options = {
        type: "info",
        defaultId: 2,
        title: "Failure!",
        message: "Content type not recognised",
      };
      dialog.showMessageBox(null, options);
      console.log(error);
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
