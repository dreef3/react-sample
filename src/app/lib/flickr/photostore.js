import {ACTIONS} from 'lib/flickr/constants';
import Store from 'lib/flux/store';

export default class PhotoStore extends Store {
    constructor() {
        super(...arguments);
        this.reset();
    }

    reset() {
        this._state = {
            
        };
    }

    get state() {
        return this._state;
    }



    *handlePayload(payload) {
        switch(payload.action) {
            case ACTIONS.USERNAME_CHANGE:
                this.fetchPhotos();
                break;
        }
    }
}
