import csp from 'js-csp';
import agent from 'superagent-promise';

import Dispatcher from 'lib/dispatcher';

const dispatcher = Dispatcher.instance();

export default class Store {
    constructor() {
        this.in = csp.chan();
        this.out = csp.chan();
        dispatcher.register(this.in);
    }

    fetch() {

    }
}
