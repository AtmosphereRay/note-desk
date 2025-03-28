import axios from 'axios';
// const axios =  require('axios');

import tunnel from "tunnel"
import { ChildProcess, execSync, spawn } from 'child_process';
import { Notification } from 'electron';
import FileManager from './fileManager';
import SystemManager from './systemManager';


class YoutubeManager {
    static instance: YoutubeManager | null = null;
    static getInstance() {
        if (this.instance == null) {
            this.instance = new YoutubeManager();
        }
        return this.instance;
    }

    hasEnvironment = true;

    private process: ChildProcess | null = null;

    constructor() {
        // try {
        //     let isSupport = execSync('yt-dlp --version', { encoding: "utf8" }).toString();
        //     this.hasEnvironment = !!isSupport;
        //     console.log(isSupport, '是否支持呢?')
        // } catch (e) {
        //     console.log(e);
        // }
    }

    readInfoByUrl(url: string, context = this) {
        console.log(url)
        var stack = [];
        this.process = spawn('yt-dlp', [
            '--get-title',
            '--get-duration',
            '--get-thumbnail',
            '--socket-timeout', '20',
            '--encoding', 'UTF-8',
            '-F', url
        ])

        console.log(['yt-dlp', '--get-title',
            '--get-duration',
            '--get-thumbnail',

            '--encoding', 'UTF-8',
            '-F', url].join(' '))

        this.process.stderr.on('data', (data) => {
            if (/Connection aborted/.test(data.toString())) {
                this.process.kill('SIGKILL');
            }
        })

        this.process.stdout.on('data', (data) => {
            stack.push(data);
            console.log('xxxxx');
        })

        this.process.on('error', (e) => {
            console.log('错误的信息是', e);
            SystemManager.getInstance().sendMessageToRender('youtubeHandle', { conf: url, eventName: "analysisError" });
        })

        this.process.on('close', async (code) => {
            console.log(code, '读取没有响应');
            if (code != 0) {
                SystemManager.getInstance().sendMessageToRender('youtubeHandle', { conf: url, eventName: "analysisError" })
                return;
            }
            this.process.kill('SIGKILL');
            this.process = null;
            const data = await context.extractMediaInfo(stack.toString());
            SystemManager.getInstance().sendMessageToRender('youtubeHandle', { conf: data, eventName: "analysisUrl" })
        })
    }


    async extractMediaInfo(text: string) {
        // console.log('输出文本是', text)
        let lines = text.split('\n');
        lines.pop();
        let time = lines.pop().replace(',', '');
        let thumbnail = lines.pop();
        let title = lines.pop().replace(',', '');

        lines.shift();
        lines.shift()
        lines = lines.filter(item => item.includes('audio only') || /144p|240p|360p|480p|720p|1080p/.test(item));

        // 存储提取的信息的数组
        let mediaInfoArray = [];

        // 处理每一行数据
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('video only')) {
                let values = lines[i].split(/\s+/);
                const [id, ext, resolution, fps, l, size, tbr, proto, l2, encoding, vbr, l3] = values
                let obj = {
                    id,
                    ext,
                    resolution,
                    fps,
                    size,
                    encoding,
                    more: values.at(-2) && values.at(-2).replace(',', '') || '',
                    tag: "video only"
                }
                mediaInfoArray.push(obj);
                continue;
            }

            if (lines[i].includes('audio only')) {
                let values = lines[i].split(/\s+/);
                const [id, ext, size] = [values[0], values[1], values[6]]
                console.log('audio', values.length, id, ext, size)
                mediaInfoArray.push({ id, ext, size, tag: "audio only" });
                continue;
            }
            // 将当前行的信息添加到数组中
            // mediaInfoArray.push(mediaInfo);
        }

        try {
            let response = await axios.get(thumbnail, {
                httpsAgent: tunnel.httpsOverHttp({
                    proxy: {
                        host: '127.0.0.1',
                        port: 11223,
                    },
                }),
                timeout: 5000,
                responseType: "arraybuffer"
            })
            const base64 = 'data:image/jpeg;base64,' + Buffer.from(response.data, 'binary').toString('base64');
            thumbnail = base64;
        } catch (e) {
            console.log(e);
        }
        return {
            array: mediaInfoArray,
            title: title.toString(),
            time,
            thumbnail
        };
    }


    startDownload(conf: { url: string, id: string, title: string, ext: string }, context = this) {
        let timer = null;
        let local = FileManager.getInstance().getRelevantPath('yt') + `/${conf.title}.${conf.ext}`;
        let many = conf.id.includes('+') ? true : false;
        let isNext = false;
        let last = 0;
        let remainType = ""
        // execSync(`rimraf "${local}"`)

        // https://www.youtube.com/watch?v=xHf1gVSAkcY
        this.process = spawn('yt-dlp', [
            `-f${conf.id}`,
            conf.url,
            '-o', `${local}`
            // '-o', "D:/youtube/%(title).150B .%(ext)s"
        ])

        SystemManager.getInstance().sendMessageToRender('youtubeHandle', { eventName: "updatePercentage", conf: { percent: 0, info: `0KiB/S 正在下载中....`, url: conf.url } })

        this.process.stdout.on('data', (data) => {
            const str: string = data.toString().replaceAll('\r', '');
            const match = str.replaceAll('\r', '').match(/\[download\]\s+(\d+\.\d)% of\s+(\d+\.\d+MiB)\s+at\s+(\S+)\s+ETA\s+(\d+:\d+)/);

            if (match && timer == null) {
                timer = setTimeout(() => {
                    match.shift();
                    let [percent, size, net, rest] = match;
                    if (many) {
                        if (isNext === false) {
                            isNext = +percent < last;
                            last = +percent;
                            remainType = "audio file remain time"
                        } else {
                            remainType = "video file remain time";
                        }
                        percent = isNext ? (50 + (+percent / 2)).toString() : (+percent / 2).toString();
                    }
                    console.log(percent, size, net, rest, 'origin:', str)
                    SystemManager.getInstance().sendMessageToRender('youtubeHandle', { eventName: "updatePercentage", conf: { percent: +percent, info: `${net} -${remainType} ${rest}  下载已完成：${percent}%`, url: conf.url } })
                    timer = null;
                }, 200);
            }
        })

        this.process.on('error', (e) => { console.log('错误的信息是', e) })
        this.process.on('close', (code) => {
            clearTimeout(timer);
            timer = null;
            if (code != 0) {
                new Notification({ body: "系统读取网页失败,请检测地址和本地网络是否正确!" }).show()
                SystemManager.getInstance().sendMessageToRender('youtubeHandle', { conf: conf.url, eventName: "downloadError" })
                return;
            }
            this.process.kill();
            this.process = null;
            console.log('任务结束后的', local)
            SystemManager.getInstance().sendMessageToRender('youtubeHandle', { conf: { local }, eventName: "downloadSuccess" })
        })
    }
}

export default YoutubeManager;