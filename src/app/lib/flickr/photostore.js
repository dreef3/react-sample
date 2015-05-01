import Store from 'lib/flux/store';


export default class PhotoStore extends Store {
    constructor() {
        super(...arguments);
        this.reset();
    }

    state() {
        return this._state;
    }

    static instance() {
        if (!PhotoStore._instance)
    }
}
