import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router";
import Events from "./pages/Events/Events.jsx";
import CreateEvent from "./pages/Create/CreateEvent.jsx";
import AuthPage from "./pages/AuthPage/AuthPage.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Events />} />
        <Route path="/createEvent" element={<CreateEvent />} />
      </Route>
      <Route path={"/auth"}>
        <Route path="login" element={<AuthPage type={"login"} />} />
        <Route path="signup" element={<AuthPage type={"signup"} />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
