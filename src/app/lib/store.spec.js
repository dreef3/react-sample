'use babel';

import Store from 'lib/store';
import csp from 'js-csp';

describe('Store', () => {
    let store = new Store();

    xit('should contain an income channel', () => {
        expect(store.in).to.be.defined();
    });

    it('should run a channels test', () => {
        let fetchCh = csp.go(function*(result) {
            yield csp.timeout(1000);
            return result;
        });

        csp.go(function*() {
            let result =
                yield csp.take(fetchCh);
            console.log(result);
        });
    });
});
