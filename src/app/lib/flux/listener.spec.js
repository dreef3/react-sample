'use strict';

import {register, inject, TestInjectionContext, TYPE} from 'lib/di/context';
import {iterate} from 'testUtil';
import csp from 'js-csp';
import Dispatcher from 'lib/flux/dispatcher';
import ActionListener from 'lib/flux/listener';

describe('ActionListener', function () {
    describe('API', function () {
        const context = new TestInjectionContext();
        const payload = {payload: 'test', source: 'test'};
        let count, listeners, result, dispatcher;

        @register(TYPE.SINGLETON, context)
        class TestDispatcher extends Dispatcher {}
        @register(TYPE.PROTOTYPE, context)
        class TestActionListener extends ActionListener {
            @inject('TestDispatcher', context)
            get dispatcher(){}

            accepts(payload) {
                return super.accepts(payload) && payload.payload !== 'done';
            }

            *handlePayload(p) {
                expect(p).to.equal(payload);
                yield* this.dispatcher.dispatch(this.createPayload('done'));
            }
        }

        function* resultCheck(payload, done) {
            if (payload.payload === 'done') {
                count++;
                if (count === listeners.length) {
                    dispatcher.destroy();
                    done();
                }
            }
        }

        beforeEach(() => {
            count = 0;
            listeners = [];
            let l = context.instance('TestActionListener');
            listeners.push(l);
            dispatcher = context.instance('TestDispatcher');
            result = csp.chan();
        });

        afterEach(() => {
            listeners.forEach((listener) => listener.destroy());
            result.close();
        });

        describe('register', function () {
            it('should handle a payload from the dispatcher', function (done) {
                expect(listeners[0]).to.not.equal(listeners[1]);

                this.timeout(0);
                csp.go(iterate, [resultCheck, result, done]);

                listeners.forEach((listener) => {
                    listener.register();
                });
                dispatcher.register(result);
                dispatcher.dispatchAsync(payload);
            });
        });
    });
});
