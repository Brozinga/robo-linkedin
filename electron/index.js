const { app, BrowserWindow, ipcMain } = require('electron');
const NavigationLinkedin = require('./puppter');
const path = require('path');

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = async () => {

  app.allowRendererProcessReuse = true;

  const mainWindow = new BrowserWindow({
    width: 500,
    height: 700,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, '../src/index.html'));
  mainWindow.setMenu(null);
  // mainWindow.webContents.openDevTools();

};

app.on('ready', () => createWindow());

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('informationsToLinkedin', (event, arg) => {
  console.log(arg)
const promise = NavigationLinkedin(arg);

Promise.all([promise])
  .then((e) => event.reply('returnFinishedProcess', e))
  .catch((err) => event.reply('returnFinishedProcess', err[0]))
})

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg)
  event.returnValue = 'pong'
})

