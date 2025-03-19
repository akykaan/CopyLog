import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Modal from "./Modal.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/modal" element={<Modal />} />
      </Routes>
    </Router>
  </Provider>
);
