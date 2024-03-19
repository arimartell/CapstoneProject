import React from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';
import './index.css';
import { createRef } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/root';
import Meal from './routes/meal';
import Login from './routes/login';
import Signup from './routes/signup';
import Profile from './routes/profile';

export const routes = [
  {
    path: '/login',
    element: <Login />,
    nodeRef: createRef(),
  },
  {
    path: '/meal',
    element: <Meal />,
    nodeRef: createRef(),
  },
  {
    path: '/signup',
    element: <Signup />,
    nodeRef: createRef(),
  },
  {
    path: '/profile',
    element: <Profile />,
    nodeRef: createRef(),
  },
];

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: routes.map((route) => ({
      index: route.path === '/',
      path: route.path === '/' ? undefined : route.path,
      element: route.element,
    })),
  },
]);

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//   </React.StrictMode>,
// );
