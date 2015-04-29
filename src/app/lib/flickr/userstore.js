'use strict';

import agent from 'superagent-promise';

import {API, ACTIONS} from 'lib/flickr/constants';
import Store from 'lib/flux/store';

export default class UserStore extends Store {
    constructor() {
        super();

        this.reset();
    }

    reset() {
        this._state = {
            id: '',
            username: '',
            name: '',
            location: '',
            profileUrl: '',
            photos: {
                count: 0
            }
        };
    }

    state() {
        return this._state;
    }

    fetchUser(username) {
        return agent('GET', API.URL)
            .query({api_key: API.KEY, method: 'flickr.people.findByUsername', username, format: 'json', nojsoncallback: 1})
            .end().then((res) => {
                res = res.body.user;
                let id = res.nsid;
                return agent('GET', API.URL)
                    .query({api_key: API.KEY, method: 'flickr.people.getInfo', user_id: id, format: 'json', nojsoncallback: 1})
                    .end();
            }).then((res) => {
                res = res.body.person;
                this._state = {
                    id: res.id,
                    username: res.username._content,
                    name: res.realname._content,
                    location: res.location._content,
                    profileUrl: res.profileurl._content,
                    photos: {
                        count: res.photos.count._content
                    }
                };

                this.dispatcher.dispatchAsync(this.createPayload(this.state(), ACTIONS.USERSTORE_CHANGE));
            })
            .catch((err) => {
                console.log(err);
            });
    }

    *handlePayload(payload) {
        switch (payload.action) {
            case ACTIONS.USERNAME_CHANGE:
                this.fetchUser(payload.payload);
                break;
        }
    }

    static instance() {
        if (!UserStore._instance) {
            UserStore._instance = new UserStore();
        }
        return UserStore._instance;
    }
}