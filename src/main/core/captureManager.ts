import { ChildProcess, exec, execFile, execSync, spawn, fork } from 'child_process';
import { desktopCapturer, shell } from 'electron';
import FileManager, { joinFilePath, removeFileSync, writeFile } from './fileManager';
import SystemManager from "./systemManager";
// import crossSpawn from 'cross-spawn'
import treeKill from 'tree-kill';


class CaptureManager {
    static instance: CaptureManager | null = null;
    static getInstance() {
        if (this.instance == null) {
            this.instance = new CaptureManager();
        }
        return this.instance;
    }

    process: ChildProcess;
    fileName: string


    startFullCapture() {
        console.log('全局录制');
        this.fileName = `${joinFilePath(FileManager.getInstance().getRelevantPath('op'), Date.now().toString())}.mp4`;
        let argus = ['-f', 'gdigrab', '-framerate', '30', '-draw_mouse', '1', '-i', 'desktop', '-c:v', 'libx264', '-preset', 'ultrafast', '-progress', '-', '-y', `${this.fileName}`]
        this.process = spawn('ffmpeg', argus);

        // this.process = exec(`ffmpeg -f gdigrab  -framerate 30 -draw_mouse 1 -i desktop  -progress - -y "D:\\output.mp4"`, (error, stdout, stderr) => {
        //     if (error) {  console.log('错误的code', error.code);  return;  }
        //     console.log(stderr, '日志信息是');
        // })
        // this.process = crossSpawn('ffmpeg', argus);

        this.process.stderr.setEncoding('utf8');

        this.process.stderr.on('data', (data) => {
            console.log(this.process.pid, data, 'hahaha');
        });

        this.process.on('exit', (code) => {
            console.log(code, '退出状态!');
            this.process = null;
            SystemManager.getInstance().sendMessageToRender('recordSuccess', this.fileName);
        })
    }

    startAppCapture() {
        desktopCapturer.getSources({
            // types: ['screen', 'window'], // 设定需要捕获的是"屏幕"，还是"窗口"
            types: ['screen'], // 设定需要捕获的是"屏幕"，还是"窗口"
            thumbnailSize: {
                height: 300, // 窗口或屏幕的截图快照高度
                width: 300 // 窗口或屏幕的截图快照宽度
            },
            fetchWindowIcons: true // 如果视频源是窗口且有图标，则设置该值可以捕获到的窗口图标
        }).then(sources => {

            sources.forEach(source => {

                // 如果视频源是窗口且有图标，且fetchWindowIcons设为true，则为捕获到的窗口图标

                // console.log(source.appIcon);

                // // 显示器Id

                // console.log(source.display_id);

                // // 视频源的mediaSourceId，可通过该mediaSourceId获取视频源

                // console.log(source.id);

                // // 窗口名，通常来说与任务管理器看到的进程名一致

                // console.log(source.name);

                // // 窗口或屏幕在调用本API瞬间抓捕到的截图快照

                // console.log(source.thumbnail);

                console.log({
                    // appIcon: source.appIcon,
                    // display_id: source.display_id,
                    id: source.id,
                    // name: source.name,
                    // thumbnail: source.thumbnail,
                    tips: "录制的全局直聘",
                    time: new Date().toLocaleString()
                })

                SystemManager.getInstance().sendMessageToRender('getSourceFromMain', source.id);

            });

        });
    }

    startAreaCapture() {

    }

    stopCaptureProcess() {
        this.process?.stdin?.write('q\n');
    }

}

export default CaptureManager;