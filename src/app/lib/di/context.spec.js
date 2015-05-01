import {inject} from 'lib/di/context';

describe.only('Context', () => {
    describe('inject decorator', () => {
        class Test {}
        class TestTarget {
            @inject(Test)
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
                    class Test1 {
                        @inject()
                        get test() {}
                    }
                }).to.throw(Error);
                expect(() => {
                    class Test3 {
                        @inject(null)
                        get test() {}
                    }
                }).to.throw(Error);
                expect(() => {
                    class Test2 {
                        @inject(undefined)
                        get test() {}
                    }
                }).to.throw(Error);
            });

            it('should throw when applied on a property without getter', () => {
                expect(() => {
                    class Test1 {
                        @inject(Test)
                        test() {}
                    }
                }).to.throw(Error);
            });
        })
    })
});
