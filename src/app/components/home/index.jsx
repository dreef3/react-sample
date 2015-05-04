import $ from 'jquery';
import React from 'react';

import {inject} from 'lib/di/context';
import {ACTIONS} from 'lib/flickr/constants';
import BaseComponent from 'components/basecomponent';
import UserInfo from 'components/home/userinfo';

class HomePage extends BaseComponent {
    constructor() {
        super();
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.state = this.store.state;
    }

    handleUsernameChange(e) {
        let username = $('#input-username').val();
        this.dispatcher.dispatchAsync({
            payload: username,
            action: ACTIONS.USERNAME_CHANGE,
            source: 'HomePage'
        });
    }

    @inject('UserStore')
    get store() {}

    render() {
        return (
            <div className="row">
                <div className="col-sm-12">
                    <h1>Home</h1>
                </div>
                <div className="col-sm-6">
                    <div className="input-group">
                        <input type="text"
                            id="input-username"
                            className="form-control"
                            placeholder="Flickr username"/>
                        <span className="input-group-btn">
                            <button
                                className="btn btn-default"
                                type="button"
                                onClick={this.handleUsernameChange}>
                                Search
                            </button>
                        </span>
                    </div>
                </div>
                <div className="col-sm-6">
                    <UserInfo {...this.state} />
                </div>
            </div>
        );
    }
}

export default HomePage;
