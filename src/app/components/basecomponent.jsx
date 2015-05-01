import React from 'react';
import Dispatcher from 'lib/flux/dispatcher';
import ActionListener from 'lib/flux/listener';
import {ACTIONS} from 'lib/flux/constants';

class __BaseComponent extends React.Component {
    constructor() {
        super();
        ActionListener.__initialize.apply(this, arguments);
    }
}
Object.define(__BaseComponent.prototype, ActionListener.prototype);
__BaseComponent.prototype.constructor = __BaseComponent;

class BaseComponent extends __BaseComponent {
    accepts(payload) {
        return ActionListener.prototype.accepts.apply(this, arguments)
            && payload.action === ACTIONS.STORE_CHANGE
            && payload.source === this.store.name;
    }

    get store() {
        throw Error('Not implemented');
    }

    componentDidMount() {
        this.register(Dispatcher.instance());
    }

    componentWillUnmount() {
        this.unregister();
    }

    *handlePayload(payload) {
        this.setState(this.store.state());
    }
}

export default BaseComponent;
