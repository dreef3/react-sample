import {API} from 'lib/flickr/constants';
import request from 'superagent-promise';

export class Agent {
    constructor(key, url) {
        this.key = key;
        this.url = url;
    }

    get defaultParams() {
        return {
            api_key: this.key,
            format: 'json', nojsoncallback: 1
        };
    }

    query(method, args) {
        const params = Object.assign({method}, this.defaultParams, args);
        return request('GET', this.url).query(params).end()
    }

    findByUsername(username) {
        return this.query('flickr.people.findByUsername', {username});
    }

    getUserInfo(user_id) {
        return this.query('flickr.people.getInfo', {user_id});
    }
}

export const agent = new Agent(API.KEY, API.URL);
