import csp from 'js-csp';

describe('Dispatcher', function () {
    let source, broadcast, listeners, result;

    beforeEach(function () {
        source = csp.chan();

        broadcast = csp.operations.mult(source);

        result = csp.chan();
        csp.operations.mult.tap(broadcast, result);

        listeners = [csp.chan(), csp.chan(), csp.chan()].map((chan) => {
            csp.operations.mult.tap(broadcast, chan);
            return chan;
        });
    });

    xit('should broadcast the payload to all listeners', function (done) {
        this.timeout(0);

        let counter = 0;
        csp.go(function*() {
            let payload = yield result;
            while (payload !== csp.CLOSED) {
                console.log('[result]', payload);
                if (payload.name === 'done') {
                    counter++;
                    console.log('[result]', counter);
                    if (counter === listeners.length) {
                        source.close();
                        csp.operations.mult.untapAll(broadcast);
                        done();
                    }
                }
                payload = yield result;
            }
        });

        listeners.forEach((chan, idx) => {
            csp.go(function*() {
                let payload = yield chan;
                while (payload !== csp.CLOSED) {
                    console.log('[listener' + idx + ']', payload);
                    if (payload.source !== idx) {
                        csp.go(function* () {
                            yield csp.put(source, {name: 'done', source: idx});
                        }).close();
                    }
                    payload = yield chan;

                }
            });
        });

        csp.putAsync(source, {name: 'test', source: -1}, () => console.log('putAsync callback'));
    });
});
