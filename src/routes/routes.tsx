import Home from '../components/pages/Home';
import React from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy loading - https://remix.run/blog/lazy-loading-routes
const getComponent = async (component: string) => {
  return { Component: (await import(component)).default };
};

export default [
  { path: '/', id: 'Home', index: true, element: <Home /> },
  {
    path: '/atm/:messageId?',
    id: 'atm',
    lazy: () => getComponent('../machines/bank/App'),
  },
  {
    path: '/login',
    id: 'login',
    lazy: () => getComponent('../machines/login/App'),
  },
  {
    path: '/simple',
    id: 'simple',
    lazy: () => getComponent('../machines/simple/App'),
  },
  {
    path: '/dog1',
    id: 'dog 1',
    lazy: () => getComponent('../machines/dog1/App'),
  },
] as RouteObject[];
