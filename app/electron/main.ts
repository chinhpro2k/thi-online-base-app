import {app, dialog, Tray,BrowserWindow} from 'electron'

import { creatAppTray } from './tray'

require('@electron/remote/main').initialize()
const log = require('electron-log');
$tools.log.info(`Application <${$tools.APP_NAME}> launched.`)
const {autoUpdater} = require("electron-updater");
const isDev = require("electron-is-dev");
autoUpdater.logger = log;
let tray: Tray

const appLock = app.requestSingleInstanceLock()

if (!appLock) {
  // 作为第二个实例运行时, 主动结束进程
  app.quit()
}

app.on('second-instance', () => {
  // 当运行第二个实例时, 打开或激活首页
  $tools.createWindow('Home')
})

app.on('ready', () => {
  if (!isDev) {
    autoUpdater.checkForUpdates();
  }
  tray = creatAppTray()
  $tools.createWindow('Home',{createConfig:{openDevTools:false,showSidebar:false},isInit:true})
})

app.on('activate', () => {
  if (process.platform == 'darwin') {
    $tools.createWindow('Home',{createConfig:{openDevTools:false}})
    if (!isDev) {
      autoUpdater.checkForUpdates();
    }
  }
})

app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') {
  //   app.quit()
  // }
})

app.on('before-quit', () => {
  $tools.log.info(`Application <${$tools.APP_NAME}> has exited normally.`)

  if (process.platform === 'win32') {
    tray.destroy()
  }
})
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});



function sendStatusToWindow(message: string,win?:BrowserWindow) {
  log.info(message);
  if (win){
    win.webContents.send('message', message);
  }

}
autoUpdater.on("update-available", (_event: any, releaseNotes: any, releaseName: any) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Ok'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version is being downloaded.'
  }
  // @ts-ignore
  dialog.showMessageBox(dialogOpts, (response) => {
  });
})
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info:any) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info:any) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err:any) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on("update-downloaded", (_event: any, releaseNotes: any, releaseName: any) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version has been downloaded. Restart the application to apply the updates.'
  };
  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall()
  })
});
// autoUpdater.on('download-progress', function (progressObj: { bytesPerSecond: string; percent: string; transferred: string; total: string; }) {
//   let log_message = "Download speed: " + progressObj.bytesPerSecond;
//   log_message = log_message + ' - Downloaded ' + parseInt(progressObj.percent) + '%';
//   log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
//   sendStatusToWindow(log_message);
// });
