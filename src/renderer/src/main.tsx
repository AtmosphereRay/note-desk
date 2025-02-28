import ReactDOM from "react-dom/client";
import { AliveScope } from "react-activation";
import App from "./App";
import GlobalExitModal from "@renderer/components/Exit";
import { Button, Modal, Space } from 'antd'
import { Demo } from "~/config/enmu";

// 状态管理
import { Provider } from "react-redux";
import { store } from "./store";
 
// window.App.addEventListener(Demo.onBeforeQuit, () => {
//   Modal.confirm({
//     title: '操作提示',
//     content: '确定要退出吗?',
//     type: "warning",
//     centered: true,
//     onOk() {
//       window.App.pubEvent(Demo.destroy)
//     },
//     onCancel() {

//     }
//   })
// })

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
