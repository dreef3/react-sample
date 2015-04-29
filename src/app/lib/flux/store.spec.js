'use strict';

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
            console.log('[store-' + this.name + ']', 'handlePayload', p);
            expect(p).to.equal(payload);
            yield* this.dispatcher.dispatch(this.createPayload('done'));
        }
    }

    describe('API', function () {
        let stores;
        let dispatcher = Dispatcher.instance();
        let result;

        beforeEach(() => {
            stores = [new TestStore(), new TestStore()];
            result = csp.chan();
        });

        afterEach(() => {
            result.close();
        });

        describe('register', function () {
            it('should handle a payload from the dispatcher', function (done) {
                this.timeout(0);

                let counter = 0;
                csp.go(function*() {
                    let payload = yield result;
                    while (payload !== csp.CLOSED) {
                        console.log('[result]', payload);
                        if (payload.payload === 'done') {
                            counter++;
                            console.log('[result]', counter);
                            if (counter === stores.length) {
                                dispatcher.destroy();
                                done();
                            }
                        }
                        payload = yield result;
                    }
                });

                stores.forEach((store) => {
                    store.register(dispatcher);
                });
                dispatcher.register(result);
                dispatcher.dispatchAsync(payload);
            });
        });
    })
});
