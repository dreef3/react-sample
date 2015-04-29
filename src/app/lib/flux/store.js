'use strict';

import csp from 'js-csp';
import agent from 'superagent-promise';

import guid from 'lib/util/guid';
import Dispatcher from 'lib/flux/dispatcher';

export default class Store {
    constructor(name) {
        this.name = name || guid();
        this.update = this.update.bind(this);
        this.handlePayload = this.handlePayload.bind(this);
        this.in = csp.chan();
    }

    state() {
    }

    register(dispatcher) {
        this.dispatcher = dispatcher;
        this.dispatcher.register(this.in);
        csp.go(this.update);
    }

    destroy() {
        if (this.dispatcher) {
            this.dispatcher.unregister(this.in);
        }
        this.in.close();
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
