import { app, BrowserWindow, dialog, ipcMain, shell } from "electron";
import SystemManager, { isProduction } from "./core/systemManager"
 
 
import { MainLogger } from "./utils/logs";
import { basename, extname, sep } from "path";
import VideoTransferManager from "./core/videoTransferManager";
import BrowserViewManager from "./core/browerviewManager";
import DownloadManager from "./core/downloadManager";
// import ChatManager from "./core/chatgptManager";
import YoutubeManager from "./core/youtubeManager";
import FileManager, { isExist, joinFilePath } from "./core/fileManager";
import ProcessManager from "./core/processManager";
import CaptureManager from "./core/captureManager";
 
class AppManager {

    public appTitle: string;
    private downloadEventMap: Record<string, Function>

    constructor(appTitle: string) {
        this.appTitle = appTitle;
        // console.log({ '默认title': "bear", appTitle, title: _conf.title });

        const execPath = process.execPath;

        // 解析出进程名称
        const processName = basename(execPath, extname(execPath));

        console.log(`Electron 应用程序的进程名称是：${processName}.exe`, process.pid);

        // 开启日志处理
        this.setupLogMiddleware();
        // 创建系统
        this.init();

        // 注册通信事件
        this.registerIpcEvent();
        this.registerAppEvent();
        this.registerSystemEvent();

        this.downloadEventMap = {
            'download-start': (event: Electron.IpcMainInvokeEvent, e: { id: string, mu: string, fn: string }) => {
                DownloadManager.getInstance().init(e.id.toString(), e.mu, e.fn);
            },
            'download-pause': () => DownloadManager.getInstance().pauseTask(),
            'check-is-exist': (event: Electron.IpcMainInvokeEvent, data: { fr: string, nm: string, cd: string, ou: string }) => {
                DownloadManager.getInstance().checkIsExist(event, data);
            },
            'request-range': (event: Electron.IpcMainInvokeEvent, data: { tm: string | object, ou: string }) => {
                console.log('啥呀哈哈哈', data);
                DownloadManager.getInstance().getVideoText(data.tm, data.ou);
            },
            'confirm-delete': (event: Electron.IpcMainInvokeEvent, data: string) => {
                console.log('删除的id', data);
                DownloadManager.getInstance().deleteById(data, event);
                try {
                    DownloadManager.getInstance().deleteTask(data);
                } catch (e) {

                }
            },
            'update-time': (event: Electron.IpcMainInvokeEvent, data: string) => {
                SystemManager.getInstance().sendMessageToRender('update-time', data);
                console.log('更新了恶魔', data)
            },
            'update-mutxt': () => {

            }
        }

        process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
    }



    init() {
        var me = this;
        app.whenReady().then(() => {
            Promise.all([
                SystemManager.getInstance().createMainWindow(me.appTitle), 
                // isProduction && ProcessManager.getInstance().startVideoSever()
            ])
        })
    }

    registerIpcEvent() {
        // 渲染进程初始化
        ipcMain.handle("createChildWindow", (event: Electron.IpcMainInvokeEvent, data: string) => {
            const { name, conf }: { name: "player" | "other", conf: PlayerWindowConf } = JSON.parse(data);
            // SystemManager.getInstance().createChildWindow(conf);
            name == "player" && SystemManager.getInstance().createPlayWindow(conf);
        })

        ipcMain.handle('addContext', (event: Electron.IpcMainInvokeEvent, data: string) => {
            const video: NavCoverItem = JSON.parse(data)
            SystemManager.getInstance().addContextMenu(video);
        })

        // 保存前检测
        ipcMain.handle('checkBeforeSave', (event: Electron.IpcMainInvokeEvent) => {
            console.log('打开编辑框');
            SystemManager.getInstance().sendMessageToRender('checkBeforeSave', undefined);
        })

        ipcMain.handle('HandleBrowserView', (event: Electron.IpcMainInvokeEvent, data: string) => {
            console.log('是否要打开', data.trim() == 'true', data, JSON.parse(data))
            JSON.parse(data)?.k ? BrowserViewManager.getInstance().init() : BrowserViewManager.getInstance().hideProxyPage();
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

        ipcMain.handle('convertHandle', (event: Electron.IpcMainInvokeEvent, data: string) => {
            const { name, val } = JSON.parse(data);
            const handle = {
                init() { },
                openFile() {
                    dialog.showOpenDialog({
                        buttonLabel: "请选择",
                        filters: [{ extensions: ['mp4', 'flv', 'mlv'], name: '' }],
                        properties: ["openFile"] //支持文件操作方式,多选("multiSelections",),单选,打开文件,打开文件夹,创建文件
                    }).then((res) => {
                        if (res.canceled === true || !res.filePaths.length) return;
                        const filePath = res.filePaths.pop() || '';
                        const name = filePath?.split(sep).pop() || '';
                        const isExist = VideoTransferManager.getInstance().checkIsExist(name)
                        isExist ? SystemManager.getInstance().sendMessageToRender('initVideoParams', isExist) : VideoTransferManager.getInstance().initTaskBeforeCreate({
                            origin: filePath,
                            output: FileManager.getInstance().getCompressOut(name),
                            name
                        })
                    })
                },
                openMultiFiles() {
                    dialog.showOpenDialog({
                        buttonLabel: "请选择",
                        properties: ["openDirectory"]
                    }).then(res => {
                        if (res.canceled === true || !res.filePaths.length) return;
                        console.log(res.filePaths)
                        const folderPath = res.filePaths.pop() || '';
                        VideoTransferManager.getInstance().scanFolder(folderPath)
                    })
                },
                startConvert() {
                    const { name, conf } = val as { name: string, conf: TransferVideoOption }
                    VideoTransferManager.getInstance().startTransferTask(name, conf);
                },
                startMultiTask() {
                    VideoTransferManager.getInstance().startMultiTask();
                },
                openOutFolder() {
                    shell.openPath(FileManager.getInstance().getCompressOut(''));
                },
                updateConf() {
                    const { name, conf } = val as { name: string, conf: RCDD }

                    VideoTransferManager.getInstance().updateConf(name, conf)
                }
            }

            handle[name] && handle[name]();
        })

        ipcMain.handle('downloadHandle', (event: Electron.IpcMainInvokeEvent, data: string) => {
            const { eventName, conf }: { eventName: string, conf: any } = JSON.parse(data);
            Object.keys(this.downloadEventMap).forEach(key => {
                eventName === key && this.downloadEventMap[key](event, conf);
            })
        })

        ipcMain.handle('youtubeHandle', (event: Electron.IpcMainInvokeEvent, data: string) => {
            const { conf, eventName } = JSON.parse(data);
            const obj = {
                analysisUrl() {
                    // console.log(conf)
                    YoutubeManager.getInstance().readInfoByUrl(conf)
                },
                startDownload() {
                    // console.log(conf)
                    YoutubeManager.getInstance().startDownload(conf);
                }
            }

            obj[eventName] && obj[eventName]()
        })

        ipcMain.handle('processHandle', (event: Electron.IpcMainInvokeEvent, data: string) => {
            const { eventName, conf }: { eventName: string, conf: any } = JSON.parse(data);
            console.log(eventName, conf)
        })

        ipcMain.handle('recordEvent', (event: Electron.IpcMainInvokeEvent, data: string) => {
            const { type }: { type: 'area' | 'window' | 'fullscreen' | 'stop' } = JSON.parse(data) || {};

            switch (type) {
                case "area": {
                    CaptureManager.getInstance().startAreaCapture();
                    return;
                }
                case 'fullscreen': {
                    CaptureManager.getInstance().startFullCapture();
                    return;
                }
                case 'window': {
                    CaptureManager.getInstance().startAppCapture();
                    return;
                }
                case "stop": {
                    CaptureManager.getInstance().stopCaptureProcess();
                    return;
                }
            }
        })

        ipcMain.handle('openShell', (event: Electron.IpcMainInvokeEvent, data: string) => {
            console.log('打开的路径', data);
            FileManager.getInstance().openRelevantShell(data);
        })

        ipcMain.handle('crawlerEvent', (event: Electron.IpcMainInvokeEvent, data: string) => {
            const { tag, _data }: { tag: "start" | 'stop' | 'pause', _data?: CrawlerInitConf } = JSON.parse(data);
            switch (tag) {
                case "start": {
                    try {
                        SystemManager.getInstance().sendMessageToRender('errorConsole', _data);

  
                    } catch (e) {
                        SystemManager.getInstance().sendMessageToRender('errorConsole', String(e));
                    }
                    return;
                }
                case "pause": {

                    return;
                }
                case "stop": {
                   
                    return
                }
            }
        });


        // ChatManager.getInstance().registerIpcEvent();


    }

    registerSystemEvent() {


        ipcMain.handle('initSysConf', () => { FileManager.getInstance().initSysConf() })

        ipcMain.handle('systemSetting', (event: Electron.IpcMainInvokeEvent, data: string) => {
            const { key, value }: { key: keyof AppSetting, value: any } = JSON.parse(data);
            // console.log(key, value);
            const handle: Record<keyof MyAppSetting, Function> = {
                'ap': function () {
                    FileManager.getInstance().updateSysSetting({ 'ap': value })
                },
                'lp': function () {
                    FileManager.getInstance().updateSysSetting({ 'lp': value })
                },
                'apiUrl': function () {
                    FileManager.getInstance().updateSysSetting({ 'apiUrl': value })
                },
                'apiKey': function () {
                    FileManager.getInstance().updateSysSetting({ 'apiKey': value })
                },
                'sp': function () {
                    console.log('打开配置');
                    dialog.showOpenDialog({
                        defaultPath: joinFilePath(FileManager.getInstance().getRelevantPath('sp'), '..'),
                        properties: ['openDirectory']
                    }).then(res => {
                        const { filePaths: [p], canceled } = res;
                        if (canceled) return;
                        FileManager.getInstance().updateSysSetting({ 'sp': p })
                    })
                },
                'op': function () {
                    console.log('打开配置');
                    dialog.showOpenDialog({
                        defaultPath: joinFilePath(FileManager.getInstance().getRelevantPath('op'), '..'),
                        properties: ['openDirectory']
                    }).then(res => {
                        const { filePaths: [p], canceled } = res;
                        if (canceled) return;
                        FileManager.getInstance().updateSysSetting({ 'op': p })
                    })
                },
                'cs': function () {
                    SystemManager.getInstance().setShutDownCount(value);
                    FileManager.getInstance().updateSysSetting({ 'cs': value })
                },
                'compress': function () {
                    dialog.showOpenDialog({
                        defaultPath: joinFilePath(FileManager.getInstance().getRelevantPath('compress'), '..'),
                        properties: ['openDirectory']
                    }).then(res => {
                        const { filePaths: [p], canceled } = res;
                        if (canceled) return;
                        FileManager.getInstance().updateSysSetting({ 'compress': p })
                    })
                },
                'workerTotal': function () {
                    FileManager.getInstance().updateSysSetting({ 'workerTotal': value })
                },
                'yt': function () {

                }
            }
            handle[key] && handle[key]();
        });
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

        process.on('SIGINT', () => {
            console.log('视频的取消了呢')
            ProcessManager.getInstance().offlineVideoSever();
        })

        process.on('exit', () => {
            ProcessManager.getInstance().offlineVideoSever();
        })

        // setTimeout(() => {
        //     console.log('结果报错!');
        //     Promise.reject('ceshiyongd ')
        //     throw new Error('瓜皮外卖员')
        // }, 5000);
    }

    handleError(msg: errorMsg) {
        SystemManager.getInstance().win?.webContents.send("errorHandler", msg);
    }
}


new AppManager('视频下载器');

