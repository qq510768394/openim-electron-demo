import { app, Menu, Tray ,nativeImage } from "electron";
import { t } from "i18next";
import { hideWindow, showWindow } from "./windowManage";
const path = require('path');
//系统图标
const iconPath = path.join(`./dist/icons/icon.ico`);

let appTray: Tray;

export const createTray = () => {
  const trayMenu = Menu.buildFromTemplate([
    {
      label: t("system.showWindow"),
      click: showWindow,
    },
    {
      label: t("system.hideWindow"),
      click: hideWindow,
    },
    {
      label: t("system.quit"),
      click: () => {
        global.forceQuit = true;
        app.quit();
      },
    },
  ]);
  appTray = new Tray(global.pathConfig.trayIcon);
  appTray.setToolTip(app.getName());
  appTray.setIgnoreDoubleClickEvents(true);
  //设置单击时展示主页
  appTray.on("click", showWindow);
  //定义上下文的菜单
  appTray.setContextMenu(trayMenu);
};

let nowFlashTimerStatus = null;
export const flashFrame=(isFlash)=>{
  //设置系统托盘闪烁
  if(isFlash){
    clearInterval(nowFlashTimerStatus)
    let flag = false
    nowFlashTimerStatus = setInterval(() => {
      flag = !flag
      if(flag){
        appTray.setImage(nativeImage.createEmpty())
      }else {
        appTray.setImage(iconPath)
      }
    },500)
  }else {
    appTray.setImage(iconPath)
    clearInterval(nowFlashTimerStatus)
  }
}

export const destroyTray = () => {
  if (!appTray || appTray.isDestroyed()) return;
  appTray.destroy();
  appTray = null;
};
