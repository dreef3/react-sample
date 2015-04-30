'use strict';

import csp from 'js-csp';
import Dispatcher from 'lib/flux/dispatcher';
import {ACTIONS} from 'lib/flickr/constants';
import UserStore from 'lib/flickr/userstore';

describe.only('UserStore', function () {
    describe('API', () => {
        let store, dispatcher = Dispatcher.instance();

        beforeEach(() => {
            store = new UserStore();
            store.register(dispatcher);
        });

        afterEach(() => {
            store.destroy();
        });

        describe('fetchUser', function () {
            it('should fetch the user info', function (done) {
                this.timeout(0);
                let listener = csp.chan();
                dispatcher.register(listener);
                csp.go(function * () {
                    let payload = yield listener;
                    expect(payload).to.have.property('payload', 'oliviabee');
                    expect(payload).to.have.property('action', ACTIONS.USERNAME_CHANGE);
                    payload = yield listener;
                    expect(payload).to.have.property('payload');
                    expect(payload.payload).to.contain.all.keys('id', 'username', 'name', 'photos', 'location');
                    expect(payload).to.have.property('action', ACTIONS.USERSTORE_CHANGE);
                    done();
                });

                dispatcher.dispatchAsync({action: ACTIONS.USERNAME_CHANGE, payload: 'oliviabee'});
            });
        });
    })
});
