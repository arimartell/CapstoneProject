import * as React from "react";
import { AnimatePresence } from "framer-motion";
import { useLocation, useRoutes } from "react-router-dom";
import Root from './routes/root';
import Meal from './routes/meal';
import Login from './routes/login';
import Signup from './routes/signup';
import Profile from './routes/profile';
import ResetPassword from './routes/resetpassword';
import Dashboard from './routes/dashboard';
import Lookup from "./routes/lookup";

export default function App() {
    const element = useRoutes([{
    path: '/login',
    element: <Login />,
  },
  {
    path: '/meal',
    element: <Meal />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  { 
    path: '/resetpassword',
    element: <ResetPassword />,

  },
  { 
    path: '/dashboard',
    element: <Dashboard />,

  },
  { 
    path: '/lookup',
    element: <Lookup />,

  },
]);
}