'use strict';

import csp from 'js-csp';
import Dispatcher from 'lib/flux/dispatcher';

describe('Dispatcher', () => {
    describe('method', () => {
        let dispatcher = new Dispatcher(),
            listeners, result, count, payload = 'test';

        function* listen(ch) {
            let payload = yield ch;
            while (payload !== csp.CLOSED) {
                if (payload )
                payload = yield ch;
            }
        }

        function* resultCheck(ch, done) {
            yield csp.take(ch);
            yield csp.take(ch);
            setTimeout(() => done());
        }

        beforeEach(() => {
            count = 0;
            result = csp.chan();
            listeners = [csp.chan(), csp.chan(), csp.chan()];
        });

        afterEach(() => {
            result.close();
            listeners.forEach((chan) => {
                chan.close();
            });
        });

        describe('dispatch', () => {
            it('should dispatch payload to all registered channels', (done) => {
                csp.spawn(listen(ch1));
                csp.spawn(listen(ch2));
                csp.spawn(results(resultCh, done));

                dispatcher.register(ch1);
                dispatcher.register(ch2);
                dispatcher.dispatch(payload);
            });
        });
    });
});
