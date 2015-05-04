import {inject, register, TestInjectionContext, TYPE} from 'lib/di/context';

describe('Context', () => {
    let context;

    beforeEach(() => {
        context = new TestInjectionContext();
    });

    describe('inject decorator', () => {
        class Test {}
        class TestTarget {
            @inject(Test, context)
            get test() {}
        }

        describe('normal call', () => {
            it('should make a field return an instance of the class', () => {
                let target = new TestTarget();
                expect(target.test).to.be.an.instanceof(Test);
            });
        });

        describe('erroneous call', () => {
            it('should throw when no Class is provided', () => {
                expect(() => {
                    class Test3 {
                        @inject(null, context)
                        get test() {}
                    }
                }).to.throw(Error);
                expect(() => {
                    class Test2 {
                        @inject(undefined, context)
                        get test() {}
                    }
                }).to.throw(Error);
            });

            it('should throw when applied on a property without getter', () => {
                expect(() => {
                    class Test1 {
                        @inject(Test, context)
                        test() {}
                    }
                }).to.throw(Error);
            });
        });
    });
    describe('register decorator', () => {
        it('should register a class instance in context', () => {
            @register(TYPE.SINGLETON, context)
            class MyClass {}

            expect(context.instance('MyClass')).to.be.instanceof(MyClass);
        });
        it('should accept an instance type', () => {
            @register(TYPE.PROTOTYPE, context)
            class MyClass1{}
            @register(TYPE.SINGLETON, context)
            class MyClass2{}

            let c1 = context.instance('MyClass1');
            let c2 = context.instance('MyClass1');
            expect(c1).to.be.instanceof(MyClass1);
            expect(c2).to.be.instanceof(MyClass1);
            expect(c1).to.not.equal(c2);

            c1 = context.instance('MyClass2');
            c2 = context.instance('MyClass2');
            expect(c1).to.be.instanceof(MyClass2);
            expect(c2).to.be.instanceof(MyClass2);
            expect(c1).to.equal(c2);
        });
        it('should inject registered dependencies', () => {
            @register(TYPE.SINGLETON, context)
            class MyClass1 {}
            @register(TYPE.SINGLETON, context)
            class MyClass2 {
                @inject('MyClass1', context)
                get test() {}
            }

            expect(context.instance('MyClass1')).to.be.instanceof(MyClass1);

            let c = context.instance('MyClass2');
            expect(c).to.be.instanceof(MyClass2);
            expect(c.test).to.be.defined;
            expect(c.test).to.be.an.instanceof(MyClass1);
        });
    });
    describe('instance method', () => {
        it('should register a new instance if constructor function passed', () => {
            class Test {}

            expect(context.has(Test)).to.be.false;
            expect(context.instance(Test)).to.be.an.instanceof(Test);
            expect(context.has(Test)).to.be.true;
        });
        it('should invoke a registered constructor', () => {
            let c1 = false, c2 = false;

            @register(TYPE.SINGLETON, context)
            class Test1 {
                constructor() {
                    c1 = true;
                }
            }

            @register(TYPE.SINGLETON, context)
            class Test {
                constructor() {
                    c2 = true;
                }

                @inject('Test1', context)
                get test() {}
            }

            expect(context.instance('Test')).to.be.an.instanceof(Test);
            expect(c1).to.be.true;
            expect(c2).to.be.true;
        });
        it('should produce a new instance each time for PROTOTYPE type', () => {
            @register(TYPE.PROTOTYPE, context)
            class Test {}

            let i1 = context.instance('Test');
            let i2 = context.instance('Test');

            expect(i1).to.be.an.instanceof(Test);
            expect(i2).to.be.an.instanceof(Test);
            expect(i1).to.not.equal(i2);
        });
    });
    describe('register method', () => {
        it('should instantiate a SINGLETON once registered', () => {
            let spy = sinon.spy(context, '_getInstance');
            let mock = sinon.mock();

            @register(TYPE.SINGLETON, context)
            class Test {
                constructor() {
                    mock();
                }
            }

            expect(spy).to.have.been.calledOnce;

            let instance = context.instance('Test');

            expect(mock).to.have.been.calledOnce;
        });
    })
});
