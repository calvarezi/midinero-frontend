// src/App.jsx
import { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import { testConnection } from "./api/testConnection";

export default function App() {
  useEffect(() => {
    testConnection();
  }, []);

  return <AppRouter />;
}
