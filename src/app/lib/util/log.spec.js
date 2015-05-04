import {log} from 'lib/util/log';

describe('Aspect', () => {
    describe('log', () => {
        let mock;
        beforeEach(() => mock = sinon.mock(console));
        afterEach(() => mock.restore());
        it('should log a call to the method', () => {
            mock.expects('log').once().withExactArgs('[call]', 'test', [1, 2, 3]);

            class Test {
                @log
                test() {}
            }

            let i = new Test();
            i.test(1, 2, 3);

            mock.verify();
        });
        it('should log a call to the property getter', () => {
            mock.expects('log').once().withExactArgs('[get]', 'test', 1);

            class Test {
                @log
                get test() {
                    return 1;
                }
            }

            let i = new Test();
            let g = i.test;

            mock.verify();
        });
        it('should log a call to the property setter', () => {
            mock.expects('log').once().withExactArgs('[set]', 'test', 1);

            class Test {
                @log
                set test(value) {}
            }

            let i = new Test();
            i.test = 1;

            mock.verify();
        });
    })
})
