import ReactDOM from "react-dom/client";
import { AliveScope } from "react-activation";
import App from "./App";
import GlobalExitModal from "@renderer/components/Exit";
import { message, message as Message } from 'antd'
// 状态管理
import { Provider } from "react-redux";
import { store } from "./store";
import "./style/base.less";
import IndexDBManager from "./util/dbStorage";
import { Demo, Essay, HttpCode } from "~/config/enmu";

window.db = new IndexDBManager(Essay.dbName, {
  tables: [{
    name: Essay.contentKey,
    keyPath: "id",
    autoIncrement: true
  }, {
    name: Essay.typeKey,
    keyPath: "id",
    autoIncrement: true,
    indexs: [{ key: "id" }, { key: "type", unique: true }]
  }]
})

window.App.addEventListener(Demo.onMessage, (message) => {
  const { type, msg } = JSON.parse(message) as { type: "success" | 'error', msg: string }
  type === "success" ? Message.success(msg) : Message.error(msg);
})

window.App.addEventListener(Demo.MongoEvent, message => {

})

window.App.addEventListener(Essay.pullArticleRes, (message) => {
  const { code, data, desc } = JSON.parse(message) as { code: HttpCode, desc: string, data: { page: number, list: any[] } }
  if (code === HttpCode.Success) {
    console.log('同步成功!', data);
    Array.isArray(data.list) && Promise.all(data.list.map(article => {
      window.db.add(Essay.contentKey, article)
    })).then(() => {
      Message.success(`同步第${data.page}页,同步数据${data.list.length}条`)
    })
  }
})


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <Provider store={store}>
    <AliveScope>
      <App />
      <GlobalExitModal />
    </AliveScope>
  </Provider>
  // </React.StrictMode>
);
