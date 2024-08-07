import { useSelector } from 'react-redux';
import { isAuthenticated } from '../assets/authSlice';
import { Navigate } from 'react-router-dom';
import { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const isUserAuth = useSelector(isAuthenticated);
  console.log('isUserAuth?:', isUserAuth);

  return (
    isUserAuth ? children : <Navigate to={"/"} />
  )
}

export default PrivateRoute;