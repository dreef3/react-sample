'use babel';
'use strict';

import React from 'react';
import {RouteHandler} from 'react-router';
import Navbar from 'components/navbar';

export default class App extends React.Component {
    render() {
        return (
        <div>
            <div className="container-fluid">
                <Navbar />
            </div>
            <div className="container">
                <RouteHandler />
            </div>
        </div>
        );
    }
}
