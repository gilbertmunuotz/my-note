import Home from "./pages/Home";
import NotFound from './components/NotFound';
import { ToastContainer } from "react-toastify";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

function App() {

  const router = createBrowserRouter([
    { path: '/', element: <Home />, errorElement: <NotFound /> },
  ]);

  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  )
}

export default App