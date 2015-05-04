'use strict';

import csp from 'js-csp';

import guid from 'lib/util/guid';
import Dispatcher from 'lib/flux/dispatcher';

export default class ActionListener {
    constructor() {
        ActionListener.__initialize.apply(this, arguments);
    }

    static __initialize(name) {
        this.name = name || guid();
        this.update = this.update.bind(this);
        this.handlePayload = this.handlePayload.bind(this);
        this.destroy = this.destroy.bind(this);
        this.register = this.register.bind(this);
        this.in = csp.chan();
    }

    register(dispatcher) {
        if (!this.in) {
            throw Error('Listener not initialized yet: ' + this.name);
        }
        if (dispatcher) {
            this.dispatcher = dispatcher;
        }
        this.dispatcher.register(this.in);
        csp.go(this.update);
    }

    destroy() {
        if (!this.in) {
            throw Error('Listener is already destroyed');
            console.trace();
        }
        if (this.dispatcher) {
            this.dispatcher.unregister(this.in);
        }
        this.in.close();
        this.in = undefined;
    }

    *update() {
        let payload = yield this.in;
        while (payload !== csp.CLOSED) {
            if (this.accepts(payload)) {
                csp.go(this.handlePayload, [payload]).close();
            }
            payload = yield this.in;
        }
    }

    accepts(payload) {
        return payload && payload.source !== this.name;
    }

    createPayload(payload, action) {
        return {
            source: this.name,
            action,
            payload
        };
    }

    *handlePayload(payload) {
    }
}
