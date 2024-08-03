import Home from "./pages/Home";
import Edit from "./pages/EditNote";
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import NotFound from './components/NotFound';
import Landingpage from './pages/LandingPage';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

function App() {

  const router = createBrowserRouter([
    { path: '/', element: <Landingpage />, errorElement: <NotFound /> },
    { path: '/home', element: <Home />, errorElement: <NotFound /> },
    { path: '/note/:id', element: <Edit />, errorElement: <NotFound /> },
    { path: '/login', element: <Login />, errorElement: <NotFound /> },
    { path: '/register', element: <Register />, errorElement: <NotFound /> }
  ]);

  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  )
}

export default App;