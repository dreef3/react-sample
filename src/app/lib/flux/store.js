'use strict';

import ActionListener from 'lib/flux/listener';

export default class Store extends ActionListener {
    constructor(name) {
        super(name);
    }

    state() {
    }
}
