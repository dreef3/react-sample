function valueToGetterSetter(descriptor) {
    if (descriptor.value) {
        let value = descriptor.value;
        delete descriptor.value;
        descriptor.get = () => value;
        if (descriptor.writable) {
            delete descriptor.writable;
            descriptor.set = (v) => {value = v;}
        }
    }
    return descriptor;
}

function _log(logger, target, key, descriptor) {
    if (descriptor.value && (typeof descriptor.value === 'function')) {
        const callee = descriptor.value;
        descriptor.value = function callLogger() {
            logger('[call]', key, Array.prototype.slice.call(arguments));
            return callee.apply(this, arguments);
        }
    } else {
        descriptor = valueToGetterSetter(descriptor);
        const getter = descriptor.get;
        descriptor.get = function getLogger() {
            const val = getter.apply(this, arguments);
            logger('[get]', key, val);
            return val;
        };
        if (descriptor.set) {
            const setter = descriptor.set;
            descriptor.set = function setLogger() {
                logger('[set]', key, arguments[0]);
                return setter.apply(this, arguments);
            }
        }
    }

    return descriptor;
}

function consoleLog() {
    console.log(...arguments);
}

function consoleLogTrace() {
    console.log(...arguments);
    console.log((new Error()).stack);
}

export function log() {
    if (arguments.length === 3) {
        return _log(consoleLog, ...arguments);
    } else if (arguments.length === 1 && arguments[0] === true) {
        return _log.bind(null, consoleLogTrace);
    }
}
