import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import { SidebarProvider } from './context/SidebarContext'
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <SidebarProvider>
        <App />
      </SidebarProvider>
    </React.StrictMode>
  </QueryClientProvider>
);
