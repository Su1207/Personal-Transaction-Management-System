import Dashboard from "./pages/Dashboard";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Category from "./pages/Category";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/category",
    element: <Category />,
  },
]);

function App() {
  return (
    <div className="App">
      <Toaster />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
