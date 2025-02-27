import { ipcRenderer, contextBridge, IpcRendererEvent } from "electron";
import _conf from "~/config/default.json";
import { join } from "path";

contextBridge.exposeInMainWorld(_conf.ipcRenderName, {

  preloadFile: join(__dirname, 'webview.js'),

  platForm: process.platform,

  isDev: process.env.NODE_ENV === 'development',

  argv: process.argv,

  arch:process.arch,

  createChildWindow() {
    ipcRenderer.invoke("createChildWindow", ...arguments);
  },

  errorHandler(cb: Function) {
    // 
    ipcRenderer.on("errorHandler", (e: IpcRendererEvent, msg: errorMsg) => {
      console.log(e);
      cb(msg);
    })
  },

  pubEvent(tag: string, data?: string | object | undefined) {
    ipcRenderer.invoke(tag, JSON.stringify(data) || '{}');
  },

  addEventListener(tag: string, cb: Function = () => { }) {
    ipcRenderer.on(tag, (e: IpcRendererEvent, msg: string) => {
      try {
        cb(msg);
      } catch (e) {
        console.log({ tag, msg });
      }
    })
  }
})




/**==functionArea==**/
