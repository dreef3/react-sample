import csp from 'js-csp';

export default {
    iterate: function* iterate(gen, ch) {
            let args = [].slice.call(arguments, 2);
            let payload = yield ch;
            while (payload !== csp.CLOSED) {
                yield* gen(...([payload].concat(args)));
                payload = yield ch;
            }
        }
}
