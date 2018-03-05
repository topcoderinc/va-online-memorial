import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Helmet } from "react-helmet";
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import { Route, BrowserRouter } from 'react-router-dom';

import Authenticator from './Authenticator';
import allReducers from './reducers';
import routes from './routes';
import './styles/styles.scss';

const middlewares = [thunk];

// Only use the redux-logger middleware in development
if (process.env.NODE_ENV === `development`) {
  middlewares.push(createLogger());
}

const store = createStore(allReducers, applyMiddleware(...middlewares));

// Helpe function that reders single route
const renderRoute = (route, props) => {
  window.scrollTo(0,0); // Reset scroll to top
  return (
    <route.component routeParams={props.match.params}/>
  );
};

// Helper function that create all routes
const createRoutes = () => routes.map((route) => (
  <Route
    exact
    key={route.path}
    path={route.path}
    component={(props) => renderRoute(route, props)}>
  </Route>
));

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <div>
        {createRoutes()}
      </div>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
