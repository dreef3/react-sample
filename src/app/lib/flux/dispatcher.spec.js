'use strict';

import {iterate} from 'testUtil';
import csp from 'js-csp';
import Dispatcher from 'lib/flux/dispatcher';

describe('Dispatcher', () => {
    describe('method', () => {
        let dispatcher, listeners, result, count, payload = 'test';

        function* listen(payload) {
            if (payload !== 'done') {
                dispatcher.dispatchAsync('done');
            }
        }

        function* resultCheck(payload, done) {
            if (payload === 'done') {
                count++;
                if (count === listeners.length) {
                    done();
                }
            }
        }

        function startListening(chan) {
            dispatcher.register(chan);
            csp.go(iterate, [listen, chan]);
        }

        beforeEach(() => {
            dispatcher = new Dispatcher();
            count = 0;

            result = csp.chan();
            dispatcher.register(result);

            listeners = [csp.chan(), csp.chan(), csp.chan()];
        });

        afterEach(() => {
            dispatcher.destroy();
            result.close();
            listeners.forEach((chan) => {
                chan.close();
            });
        });

        describe('dispatch', () => {
            it('should dispatch payload to all registered channels', (done) => {
                csp.go(iterate, [resultCheck, result, done]);

                listeners.forEach(startListening);

                csp.go(function *() {
                    yield* dispatcher.dispatch(payload);
                });
            });
        });

        describe('register', () => {
            it('should add a channel to payload recievers', (done) => {
                let chan = csp.chan();

                dispatcher.register(chan);
                csp.go(function *() {
                    let p = yield chan;
                    expect(p).to.equal(payload);
                    done();
                });

                dispatcher.dispatchAsync(payload);
            });
        });

        describe('unregister', () => {
            it('should remove a channel from payload recievers', () => {
                return new Promise((resolve, reject) => {
                    let c = listeners.length;
                    dispatcher.unregister(listeners.pop());

                    csp.go(iterate, [resultCheck, result, () => {
                        expect(count).to.equal(c - 1);
                        resolve();
                    }]);

                    listeners.forEach(startListening);

                    csp.go(function *() {
                        yield* dispatcher.dispatch(payload);
                    });
                });
            });
        })
    });
});
