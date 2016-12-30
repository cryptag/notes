const electron = require('electron')
const shelljs = require('shelljs')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1280, height: 800})
  mainWindow.maximize();

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Start cryptagd
const spawn = require('child_process').spawn;
const fs = require('fs');

const spawnCryptagd = (runCmd) => {
  console.log('spawnCryptagd', runCmd);
  const cryptagd = spawn(runCmd);

  cryptagd.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  cryptagd.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  cryptagd.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

let runCmd = path.join(__dirname, 'cryptagd');

if (['darwin', 'linux'].indexOf(process.platform) > -1){
  fs.stat(runCmd, function(err, stat){
    if (!err){
      // spawn the binary in local project dir if exists
      spawnCryptagd(runCmd);
    } else if (err.code === "ENOENT") {
      console.log('cryptagd file does not exist! Trying system-wide...');
      shelljs.exec('echo `which cryptagd`', function(code, stdout, stderr){
        spawnCryptagd(stdout.trim());
      });
    }
  })
} else if (process.platform === 'win32'){
  spawnCryptagd(runCmd + '.exe');
}
