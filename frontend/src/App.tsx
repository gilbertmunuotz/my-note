import Home from "./pages/Home";
import Edit from "./pages/EditNote";
import NotFound from './components/NotFound';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

function App() {

  const router = createBrowserRouter([
    { path: '/', element: <Home />, errorElement: <NotFound /> },
    { path: '/note/:id', element: <Edit />, errorElement: <NotFound /> },
  ]);

  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  )
}

export default App;