'use strict';

import {iterate} from 'testUtil';
import csp from 'js-csp';
import Dispatcher from 'lib/flux/dispatcher';
import Store from 'lib/flux/store';

describe('Store', function () {
    let payload = {payload: 'test', source: 'test'};
    class TestStore extends Store {
        accepts(payload) {
            return super.accepts(payload) && payload.payload !== 'done';
        }

        *handlePayload(p) {
            expect(p).to.equal(payload);
            yield* this.dispatcher.dispatch(this.createPayload('done'));
        }
    }

    describe('API', function () {
        let count, stores, dispatcher = Dispatcher.instance(), result;

        function* resultCheck(payload, done) {
            if (payload.payload === 'done') {
                count++;
                if (count === stores.length) {
                    dispatcher.destroy();
                    done();
                }
            }
        }

        beforeEach(() => {
            count = 0;
            stores = [new TestStore(), new TestStore()];
            result = csp.chan();
        });

        afterEach(() => {
            stores.forEach((store) => store.unregister());
            result.close();
        });

        describe('register', function () {
            it('should handle a payload from the dispatcher', function (done) {
                this.timeout(0);
                csp.go(iterate, [resultCheck, result, done]);

                stores.forEach((store) => {
                    store.register(dispatcher);
                });
                dispatcher.register(result);
                dispatcher.dispatchAsync(payload);
            });
        });
    });
});
