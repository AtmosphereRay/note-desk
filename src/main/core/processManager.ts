import { ChildProcess, execFile } from "child_process";
import { Notification } from "electron";
import { existsSync, writeFileSync } from "fs";
import FileManager, { joinFilePath } from "./fileManager";
import treeKill from "tree-kill";
import SystemManager from "./systemManager";

class ProcessManager {
    static instance: ProcessManager | null = null;
    static getInstance() {
        if (this.instance == null) {
            this.instance = new ProcessManager();
        }
        return this.instance;
    }

    public pros: string[];
    public currentSever: any;


    private serverFolder = "D:\\nodeProject\\server";
    private videoSever: ChildProcess | null;

    constructor() {
        // this.scanAllNodeApps();
    }


    // !todo  Nodejs Application control center
    scanAllNodeApps() {
        const pros = FileManager.getInstance().getServerFolderApps(this.serverFolder);

    }

    startVideoSever() {
        let batPath = joinFilePath(FileManager.getInstance().getProjectPath(), 'app.asar.unpacked', 'resources', 'server.bat');

        if (existsSync(batPath)) {
            this.videoSever = execFile(batPath);
            this.videoSever.stdout.on('data', (data) => {
                data.toString().includes('服务启动成功') && SystemManager.getInstance().sendMessageToRender('serverStart');
            });

            this.videoSever.on('error', (e) => {
                // @ts-ignore
                new Notification({ title: "服务启动error提示", body: JSON.stringify({ msg: e.message, type: e.cause, ...e }) }).show();
                // @ts-ignore
                writeFileSync('D:\\dde.txt', JSON.stringify({ msg: e.message, type: e.cause, __dirname, exist: existsSync(batPath) }));
            })
        }
    }


    offlineVideoSever() {
        return new Promise((resolve, reject) => {
            this.videoSever?.on('close', () => { resolve(true); })
            treeKill(this.videoSever?.pid, 'SIGTERM', (err) => {
                if (err) {
                    reject(true)
                }
                else {
                    this.videoSever = null;
                    resolve(true);
                }
            })
        })
    }
}

export default ProcessManager;