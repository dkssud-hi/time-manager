import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./routes/Home.tsx";
import Report from "./routes/Report.tsx";
import AddTodo from "./components/AddTodo.tsx";

import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "add-todo",
        element: <AddTodo />,
      },
    ],
  },
  {
    path: "report",
    element: <Report />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
