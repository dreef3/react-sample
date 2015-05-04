import {agent} from 'lib/flickr/agent';

import {register} from 'lib/di/context';
import {API, ACTIONS} from 'lib/flickr/constants';
import * as STORE from 'lib/flux/constants';
import Store from 'lib/flux/store';

@register()
export default class UserStore extends Store {
    constructor() {
        super(...arguments);
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

    get state() {
        return this._state;
    }

    fetchUser(username) {
        return agent.findByUsername(username).then((res) => {
                res = res.body.user;
                let user_id = res.nsid;
                return agent.getUserInfo({user_id});
            }).then((res) => {
                console.log(res);
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

                this.dispatcher.dispatchAsync(this.createPayload(this.state(),
                    STORE.ACTIONS.STORE_CHANGE));
            })
            .catch((err) => {
                //this.dispatcher.dispatchAsync(this.createPayload(err, STORE.ACTIONS.ERROR));
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
}
