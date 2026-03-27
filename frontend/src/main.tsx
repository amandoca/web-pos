import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { AppProviders } from "./app/providers/AppProviders";
import { App } from "./App";
import "./index.css";

// Monta a aplicação React na raiz da página.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* Providers globais primeiro, rotas depois, e por fim a aplicação. */}
    <AppProviders>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppProviders>
  </React.StrictMode>,
);
