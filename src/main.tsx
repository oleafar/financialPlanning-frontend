import React from "react";
import ReactDOM from "react-dom/client";
import { App as AntApp, ConfigProvider } from "antd";
import ptBR from "antd/locale/pt_BR";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { appQueryClient } from "./services/query-client";
import { appTheme } from "./styles/theme";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider theme={appTheme} locale={ptBR}>
      <AntApp>
        <QueryClientProvider client={appQueryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </AntApp>
    </ConfigProvider>
  </React.StrictMode>,
);
