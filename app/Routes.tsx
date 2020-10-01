/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from './containers/App';

import SchemaWizard from './containers/SchemaWizard';
import ProductPage from './containers/ProductPage';
import TablePage from './containers/TablePage';
import HomePage from './containers/HomePage';
import TestPage from './containers/TestPage';
import TabsPage from './containers/TabsPage';
import Color from './containers/ColorPage';
import PinCode from './containers/PinCode';

// Lazily load routes and code split with webpack
const LazyCounterPage = React.lazy(() =>
  import(/* webpackChunkName: "CounterPage" */ './containers/CounterPage')
);

const CounterPage = (props: Record<string, any>) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
    <LazyCounterPage {...props} />
  </React.Suspense>
);

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path="/products" component={ProductPage} exact />
        <Route path="/schema-wizard" component={SchemaWizard} exact />
        <Route path="/table/:table" component={TablePage} exact />
        <Route path="/test" component={TestPage} exact />
        <Route path="/tabs" component={TabsPage} exact />
        <Route path="/pincode" component={PinCode} exact />
        <Route path="/color" component={Color} exact />
        <Route path="/" component={HomePage} exact />
      </Switch>
    </App>
  );
}
