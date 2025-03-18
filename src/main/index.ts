import { app, BrowserWindow, dialog, ipcMain, shell } from "electron";
import SystemManager, { isProduction } from "./core/systemManager"


import { MainLogger } from "./utils/logs";
import { basename, extname, sep } from "path";
import BrowserViewManager from "./core/browerviewManager";
import FileManager, { isExist, joinFilePath } from "./core/fileManager";
import ProcessManager from "./core/processManager";
import { Demo, Essay, HttpCode } from "@conf/enmu";
import ServerManager from "./core/serverManager";

import { sendResponse } from "./utils/url";




class AppManager {

    public appTitle: string;
    private downloadEventMap: Record<string, Function>

    constructor(appTitle: string) {
        this.appTitle = appTitle;
        const execPath = process.execPath;
        // 解析出进程名称
        const processName = basename(execPath, extname(execPath));

        console.log(`Electron application name：${processName.toString()}.exe`, process.pid);

        // 开启日志处理
        this.setupLogMiddleware();
        // 创建系统
        this.init();

        // 注册通信事件
        this.registerIpcEvent();
        this.registerAppEvent();
        this.registerSystemEvent();
        this.registerMongoEvent()

        process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
    }



    init() {
        var me = this;
        ServerManager.getInstance().connectMongo();
        app.whenReady().then(() => {
            Promise.all([
                SystemManager.getInstance().createMainWindow(me.appTitle),
                // isProduction && ProcessManager.getInstance().startVideoSever()
            ])
        })
    }

    registerIpcEvent() {
        // 注册销毁事件
        ipcMain.handle(Demo.destroy, async () => {
            await SystemManager.getInstance().destroyApp();
            process.exit(0)
        })

        ipcMain.handle('addContext', (event: Electron.IpcMainInvokeEvent, data: string) => {
            const video: NavCoverItem = JSON.parse(data)
            SystemManager.getInstance().addContextMenu(video);
        })



        ipcMain.handle('openDesignatedShell', (event: Electron.IpcMainInvokeEvent, data: string) => {
            let { eventName, url } = JSON.parse(data);
            url = url.replaceAll('"', '').replaceAll("\\\\", "\\")
            eventName = eventName || 'openDirectly'
            const handle = {
                openDirectly() {
                    url && isExist(url) && shell.openPath(url);
                },
                openJsFolder() {
                    url = joinFilePath(FileManager.getInstance().getRelevantPath('sp'), url);
                    url && isExist(url) && shell.openPath(url);
                },
                openVideoPath() {
                    url && isExist(url) && shell.openPath(url);
                }
            }

            handle[eventName] && handle[eventName]()

        })


        ipcMain.handle('processHandle', (event: Electron.IpcMainInvokeEvent, data: string) => {
            const { eventName, conf }: { eventName: string, conf: any } = JSON.parse(data);
            console.log(eventName, conf)
        })


        ipcMain.handle('openShell', (event: Electron.IpcMainInvokeEvent, data: string) => {
            console.log('打开的路径', data);
            FileManager.getInstance().openRelevantShell(data);
        })
    }

    registerSystemEvent() {

    }

    registerAppEvent() {
        app.on('activate', () => {
            const allWindows = BrowserWindow.getAllWindows()
            if (allWindows.length) {
                allWindows[0].focus()
            } else {
                SystemManager.getInstance().createMainWindow(this.appTitle);
            }
        })

        app.on('before-quit', () => {
            ProcessManager.getInstance().offlineVideoSever();

        })

        app.on('window-all-closed', () => SystemManager.getInstance().quitSystem())
    }

    setupLogMiddleware() {
        process.on("uncaughtException", function (errInfo: Error, origin: NodeJS.UncaughtExceptionOrigin) {
            let sendMsg: errorMsg = {
                type: "jsError",
                message: String(errInfo),
                origin,
                stack: errInfo?.stack?.split("\n").at(1)?.split(FileManager.getInstance().getProjectPath()).pop() || "",
                name: errInfo.name,
                time: new Date().toLocaleString(),

            }
            console.log(sendMsg, '主进程');
            // electronApp.handleError(sendMsg);
            MainLogger.error(JSON.stringify(sendMsg));

        })

        process.on("unhandledRejection", function (reason: Error, origin: any) {
            console.log("handle rejection", ...arguments);
            let sendMsg: errorMsg = {
                type: "rejectionError",
                message: String(reason),
                origin,
                stack: reason?.stack?.split("\n").at(1)?.split(FileManager.getInstance().getProjectPath()).pop() || "",
                name: reason.name,
                time: new Date().toLocaleString(),

            }
            isProduction === false && console.log(sendMsg, '异步进程');

            MainLogger.error(JSON.stringify(sendMsg));

            SystemManager.getInstance().sendMessageToRender("errorConsole", { msg: sendMsg.message, stack: sendMsg.stack });
        })
    }

    handleError(msg: errorMsg) {
        SystemManager.getInstance().win?.webContents.send("errorHandler", msg);
    }

    registerMongoEvent() {
        ipcMain.handle(Demo.MongoEvent, (event: Electron.IpcMainInvokeEvent, msgStr: string) => {
            event.preventDefault();
            const { e, data } = JSON.parse(msgStr) as { e: 'add' | 'del' | 'get' | 'put' | "sync", data: any }
            if (ServerManager.getInstance().isConnect() === false) {
                SystemManager.getInstance().sendMessageToRender(Demo.onMessage, { type: "error", msg: "DB is not connected!" })
                return;
            }
            switch (e) {
                case "add": {
                    ServerManager.getInstance().addData(data.name, data.data)
                    break;
                }
                case "sync": {
                    ServerManager.getInstance().syncRemoteData()
                        .then(res => {
                            sendResponse(event, { e: Essay.syncRes, data: { data, code: HttpCode.Success } })
                        }).catch((e) => {
                            // event.sender.send("eventTest")
                            sendResponse(event, { e: Essay.syncRes, data: { data, code: HttpCode.Error } })
                        })

                    break;
                }
            }
        })
    }
}


new AppManager('视频下载器');

