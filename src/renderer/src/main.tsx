import ReactDOM from "react-dom/client";
import { AliveScope } from "react-activation";
import App from "./App";
import GlobalExitModal from "@renderer/components/Exit";
import { message as Message } from 'antd'
// 状态管理
import { Provider } from "react-redux";
import { store } from "./store";
import "./style/base.less";
import IndexDBManager from "./util/dbStorage";
import { Demo, Essay } from "~/config/enmu";

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
