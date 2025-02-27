import ReactDOM from "react-dom/client";
import { AliveScope } from "react-activation";
import App from "./App";


// 状态管理
import { Provider } from "react-redux";
import { store } from "./store";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
    <Provider store={store}>
      <AliveScope>
        <App />
      </AliveScope>
    </Provider>
  // </React.StrictMode>
);
