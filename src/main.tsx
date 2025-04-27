import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store.tsx";
import { Routes, Route, HashRouter } from "react-router-dom";
import { Suspense } from "react";
import Modal from "./screens/modals/Modal.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <HashRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/modal" element={<Modal />} />
        </Routes>
      </Suspense>
    </HashRouter>
  </Provider>
);
