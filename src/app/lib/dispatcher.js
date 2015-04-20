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

    dispatch(payload) {
        csp.putAsync(this.eventChannel, payload);
    }

    static instance() {
        if (!Dispatcher._instance) {
            Dispatcher._instance = new Dispatcher();
        }
        return Dispatcher._instance;
    }
}
