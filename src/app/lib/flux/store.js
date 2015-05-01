'use strict';

import ActionListener from 'lib/flux/listener';

export default class Store extends ActionListener {
    state() {
    }

    get actions() {
        return [];
    }

    accepts(payload) {
        return super.accepts(...arguments)
            && this.actions.some((action) => action === payload.action);
    }
}
