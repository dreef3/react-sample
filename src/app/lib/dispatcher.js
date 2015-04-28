'use strict';

import csp from 'js-csp';

export default class Dispatcher {
    constructor() {
        this.eventChannel = csp.chan();
        this.broadcast = csp.operations.mult(this.eventChannel);
    }

    register(channel) {
        csp.operations.mult.tap(this.broadcast, channel);
    }

    unregister(channel) {
        csp.operations.mult.untap(this.broadcast, channel);
    }

    dispatchAsync(payload) {
        return new Promise((resolve, reject) => {
            csp.putAsync(this.eventChannel, payload, () => resolve(this));
        });
    }

    *dispatch(payload) {
        yield csp.put(this.eventChannel, payload);
    }

    destroy() {
        csp.operations.mult.untapAll(this.broadcast);
        this.eventChannel.close();
        if (Dispatcher._instance === this) {
            Dispatcher._instance = undefined;
        }
    }

    static instance() {
        if (!Dispatcher._instance) {
            Dispatcher._instance = new Dispatcher();
        }
        return Dispatcher._instance;
    }
}
