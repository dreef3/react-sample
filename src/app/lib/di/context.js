const instances = new Map();

export class Context {
    static instance(Class) {
        let args = Array.prototype.slice.call(arguments, 1);
        let instance = instances.get(Class);
        if (!instance) {
            instance = new Class(...args);
            instances.set(Class, instance);
        }
        return instance;
    }

    static reset() {
        instances.clear();
    }
}

class InjectError extends Error {}

export function inject(Class) {
    if (typeof Class === 'undefined' || !Class) {
        throw new InjectError();
    }

    return function injectDecorator(target, key, descriptor) {
        if (!descriptor || !descriptor.get) {
            throw new InjectError();
        }

        const instance = Context.instance(Class);
        descriptor.get = () => instance;
        return descriptor;
    }
}
