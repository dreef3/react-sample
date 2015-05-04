import guid from 'lib/util/guid';

class ContextError extends Error {
    constructor(message, context) {
        super(...arguments);
        this.name = 'ContextError';
        this.stack = (new Error()).stack;
        if (context) {
            this.contextName = context.name;
        }
    }
}

class InjectError extends ContextError {
    constructor() {
        super(...arguments);
        this.name = 'InjectError';
    }
}

export const TYPE = {
    SINGLETON: 'singleton', PROTOTYPE: 'prototype'
};

class ContextEntry {
    constructor(Class, type, args, instance) {
        Object.assign(this, {Class, type, instance, args});
    }
}

export class InjectionContext {
    constructor() {
        this.name = guid();
        this._contextEntries = new Map();
    }

    instance(Class) {
        if (typeof Class === 'function' || Class instanceof Function) {
            if (!this.has(Class)) {
                this.register(Class);
            }
            return this.instance(Class.name);
        } else if (typeof Class === 'string') {
            return this._getInstance(Class);
        } else {
            throw new ContextError('Class must be either a function or a string', Class);
        }
    }

    has(Class) {
        let name = Class;
        if (typeof Class === 'function') {
            name = Class.name;
        }
        return this._contextEntries.has(name);
    }

    _getInstance(className) {
        let entry = this._contextEntries.get(className);
        if (!entry) {
            throw new ContextError('No registered instance found: ' + className, this);
        }

        let instance = entry.instance;
        if (entry.type === TYPE.PROTOTYPE || !instance) {
            instance = new entry.Class(...entry.args);
            if (entry.type === TYPE.SINGLETON) {
                entry.instance = instance;
            }
        }

        return instance;
    }

    register(Class, name = null, type = TYPE.SINGLETON, args = []) {
        if (type !== TYPE.SINGLETON && type !== TYPE.PROTOTYPE) {
            throw new ContextError('Wrong entry type: ' + type, this);
        }
        if (name === null) {
            name = Class.name;
        }

        let entry = new ContextEntry(Class, type, args);
        this._contextEntries.set(name, entry);
        if (type === TYPE.SINGLETON) {
            this._getInstance(name);
        }
    }
}

export class TestInjectionContext extends InjectionContext {
    reset() {
        this._contextEntries.clear();
    }
}

export const Context = new InjectionContext();

export function inject(Class, context = Context) {
    if (typeof Class === 'undefined' || !Class) {
        throw new InjectError('Required Class attribute not set', context);
    }

    return function injectDecorator(target, key, descriptor) {
        if (!descriptor || !descriptor.get) {
            throw new InjectError('Target is not a getter property', context);
        }

        const instance = context.instance(Class);
        descriptor.get = () => instance;
        return descriptor;
    }
}

export function register(type = TYPE.SINGLETON, context = Context) {
    let args = Array.prototype.slice.call(arguments, 2);
    return function registerDecorator(target) {
        if (typeof target !== 'function') {
            throw new ContextError('Target must be a constructor function', context)
        }
        context.register(target, null, type, args);
        return target;
    }
}
