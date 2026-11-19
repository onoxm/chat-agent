import { app, BrowserWindow, ipcMain } from "electron";
import started from "electron-squirrel-startup";
import { ipcMainAction } from "./ipc";
import { createTray } from "./tray";
import { windowManager } from "./window";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  windowManager.create();

  // const appMenu = Menu.getApplicationMenu()?.items ?? [];

  // const menuTemplate: MenuItemConstructorOptions[] = [
  //   {
  //     role: "help",
  //     submenu: [
  //       {
  //         label: "Documentation",
  //         click: () => {
  //           shell.openExternal("https://space.bilibili.com/824806");
  //         },
  //       },
  //     ],
  //   },
  // ];

  // const menu = Menu.buildFromTemplate([...appMenu, ...menuTemplate]);
  // Menu.setApplicationMenu(menu);

  ipcMainAction.on.forEach(({ channel, handle }) =>
    ipcMain.on(channel, handle),
  );

  ipcMainAction.handle.forEach(({ channel, handle }) =>
    ipcMain.handle(channel, handle),
  );

  createTray();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      windowManager.create();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
