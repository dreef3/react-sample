'use strict';

import React from 'react';

import csp from 'js-csp';
import Dispatcher from 'lib/flux/dispatcher';
import {ACTIONS} from 'lib/flickr/constants';
import UserStore from 'lib/flickr/userstore';

const userStore = UserStore.instance();
const dispatcher = Dispatcher.instance();

class HomePage extends React.Component {
    constructor() {
        super();
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.state = userStore.state();

        this.in = csp.chan();
        dispatcher.register(this.in);
        csp.go(this.update);
    }

    handleUsernameChange(e) {
        let username = e.target.value;
        dispatcher.dispatchAsync({payload: username, action: ACTIONS.USERNAME_CHANGE, source: 'HomePage'});
    }

    render() {
        return (
            <div className="row">
                <div className="col-sm-12">
                    <h1>Home</h1>
                </div>
                <div className="col-sm-6">
                    <div className="input-group">
                        <input type="text" className="form-control" placeholder="Flickr username"/>
                        <span className="input-group-btn">
                            <button className="btn btn-default" type="button" onClick={this.handleUsernameChange}>
                                Search
                            </button>
                        </span>
                    </div>
                </div>
                <div className="col-sm-6"></div>
            </div>
        )
    }
}

export default HomePage;
