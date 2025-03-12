import { ipcRenderer, contextBridge, IpcRendererEvent } from "electron";
import { join } from "path";
import { Demo } from "~/config/enmu";

console.log(process.env, process.cwd())

contextBridge.exposeInMainWorld('App', {

  preloadFile: join(__dirname, 'webview.js'),

  platform: process.platform,

  isDev: process.env.NODE_ENV === 'development',

  argv: process.argv,

  arch: process.arch,

  onQuit: (cb: () => void) => {
    ipcRenderer.on(Demo.onBeforeQuit, cb)
  },

  onBeforeDestroy: (cb: () => void) => {
    ipcRenderer.on(Demo.onBeforeDestroy, cb)
  },

  createChildWindow() {
    ipcRenderer.invoke("createChildWindow", ...arguments);
  },

  errorHandler(cb: (msg: errorMsg) => void) {
    ipcRenderer.on("errorHandler", (e: IpcRendererEvent, msg: errorMsg) => cb(msg))
  },

  pubEvent(tag: Demo, data?: string | object | undefined) {
    ipcRenderer.invoke(tag, JSON.stringify(data) || '{}');
  },

  addEventListener(tag: string, cb: (msg?: any) => void) {
    console.log(tag, '注册时', cb);
    ipcRenderer.on(tag, (e: IpcRendererEvent, msg: string) => {
 
      try { cb(msg); } catch (e) {
        console.log({ tag, msg });
      }
    })
  },

  once(tag: string, cb: (msg?: any) => void) {
    console.log(tag, '注册时', cb)
    ipcRenderer.once(tag, (e: IpcRendererEvent, msg: string) => {
      try { cb(msg); } catch (e) {
        console.log({ tag, msg });
      }
    })
  }

} as RendererAPI)




/**==functionArea==**/
