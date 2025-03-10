import ReactDOM from "react-dom/client";
import { AliveScope } from "react-activation";
import App from "./App";
import GlobalExitModal from "@renderer/components/Exit";
import { Button, Modal, Space } from 'antd'
// 状态管理
import { Provider } from "react-redux";
import { store } from "./store";
import "./style/base.less";
import IndexDBManager from "./util/dbStorage";
import { Eassy } from "~/config/enmu";

window.db = new IndexDBManager(Eassy.dbName, {
  tables: [{
    name: Eassy.contentKey,
    keyPath: "id",
    autoIncrement: true
  }, {
    name: Eassy.typeKey,
    keyPath: "id",
    autoIncrement: true,
    indexs: [{ key: "id" }, { key: "type", unique: true }]
  }]
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
