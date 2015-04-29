import React from 'react';
import Router from 'react-router';

import App from 'components/app';
import HomePage from 'components/home';
import PhotosPage from 'components/photos';

const Route = Router.Route;
const RouteHandler = Router.RouteHandler;
const DefaultRoute = Router.DefaultRoute;

const routes = (
    <Route name="app" path="/" handler={App}>
        <Route name="photos" handler={PhotosPage} />
        <DefaultRoute handler={HomePage} />
    </Route>
);

export default () => Router.run(routes, (Handler) => React.render(<Handler />, document.body));
