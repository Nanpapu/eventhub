import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { LanguageProvider } from "./contexts/LanguageContext";
import { store } from "./app/store";
import router from "./routes";
import "./utils/i18n"; // Import i18n trước khi render app
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <LanguageProvider>
        <RouterProvider router={router} />
      </LanguageProvider>
    </Provider>
  </React.StrictMode>
);
