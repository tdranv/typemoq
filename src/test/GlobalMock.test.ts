﻿import * as TypeMoq from '../typemoq';

import { TestData, GlobalBar, IGlobalBar, someGlobalFunc, someGlobalFuncWithArgs } from './fixtures';
import { Utils } from './Utils';

const GlobalMock = TypeMoq.GlobalMock;
const GlobalScope = TypeMoq.GlobalScope;
const It = TypeMoq.It;
const Times = TypeMoq.Times;

let container: any;
if (Utils.isNodeJS()) {
    container = global;
} else {
    container = window;
}

container['someGlobalFunc'] = someGlobalFunc;
container['someGlobalFuncWithArgs'] = someGlobalFuncWithArgs;
container['GlobalBar'] = GlobalBar;
container['XMLHttpRequest'] = TestData.XMLHttpRequest;

const hasProxyES6 = (typeof Proxy != 'undefined');
const noProxyES6Msg = 'global \'Proxy\' object not available';

describe.skip('GlobalMock', () => {

    describe('ctor', () => {

        it('should create an instance using class as ctor parameter', () => {

            const mock: TypeMoq.IGlobalMock<GlobalBar> = GlobalMock.ofType(GlobalBar, container);

            expect(mock).not.toBeNull();
        });

        it('should create an instance using interface as type variable and allow interface cast', () => {

            const mock: TypeMoq.IGlobalMock<IGlobalBar> = GlobalMock.ofType(GlobalBar, container);

            expect(mock).not.toBeNull();
        });

        it('should create an instance using interface as type variable and class as ctor parameter', () => {

            const mock: TypeMoq.IGlobalMock<IGlobalBar> = GlobalMock.ofType<IGlobalBar>(GlobalBar, container);

            expect(mock).not.toBeNull();
        });

        it('should create an instance using class as ctor parameter and ctor args', () => {

            const bar = new TestData.Bar();
            const foo = new TestData.Foo(bar);
            const mock: TypeMoq.IGlobalMock<TestData.Foo> = GlobalMock.ofInstance(foo, 'foo', container);

            expect(mock.object).not.toBeNull();
        });

        it('should create an instance using a generic class as ctor parameter and ctor args', () => {

            const foo = new TestData.GenericFoo(TestData.Bar);
            const mock: TypeMoq.IGlobalMock<TestData.GenericFoo<TestData.Bar>> = GlobalMock.ofInstance(foo, 'foo', container);

            expect(mock.object).not.toBeNull();
        });

        it('should create an instance from an existing object', () => {

            const bar = new GlobalBar();

            const mock: TypeMoq.IGlobalMock<GlobalBar> = GlobalMock.ofInstance(bar, 'bar', container);

            expect(mock).not.toBeNull();
        });

        it('should create an instance from a function object', () => {

            const mock1: TypeMoq.IGlobalMock<() => string> = GlobalMock.ofInstance(someGlobalFunc, undefined, container);
            const mock2: TypeMoq.IGlobalMock<(a: any, b: any, c: any) => string> = GlobalMock.ofInstance(someGlobalFuncWithArgs, undefined, container);

            expect(mock1).not.toBeNull();
            expect(mock2).not.toBeNull();
        });

        describe('dynamic mock', () => {

            it('should create an instance using only a type variable', () => {

                if (!hasProxyES6) {
                    console.log(noProxyES6Msg);
                } else {
                    const mock: TypeMoq.IGlobalMock<TestData.IThing> = GlobalMock.ofType2<TestData.IThing>('TypeMoqTests.IThing', container);

                    expect(mock.object).not.toBeNull();
                    expect(mock.object.getA('abc')).not.toBeNull();
                    expect(mock.object.getB(123)).not.toBeNull();
                    expect(mock.object.getC()).not.toBeNull();
                    expect(mock.object.valueA).not.toBeNull();

                }
            });

        });

    });

    describe('scope.using and .with (auto sandboxing)', () => {

        it('should check that global no args function is auto sandboxed', () => {

            const mock = GlobalMock.ofInstance(someGlobalFunc, undefined, container);

            mock.verify(x => x(), Times.never());

            GlobalScope.using(mock).with(() => {

                container.someGlobalFunc();
                container.someGlobalFunc();

                mock.verify(x => x(), Times.exactly(2));

            });

            container.someGlobalFunc();

            mock.verify(x => x(), Times.exactly(2));
        });

        it('should check that global function with args is auto sandboxed', () => {

            const mock = GlobalMock.ofInstance(someGlobalFuncWithArgs, undefined, container);

            mock.verify(x => x(It.isAny(), It.isAny(), It.isAny()), Times.never());

            GlobalScope.using(mock).with(() => {

                container.someGlobalFuncWithArgs(1, 2, 3);
                container.someGlobalFuncWithArgs('1', '2', '3');
                container.someGlobalFuncWithArgs(1, 2, 3);

                mock.verify(x => x(1, 2, 3), Times.exactly(2));

            });

            container.someGlobalFuncWithArgs(1, 2, 3);

            mock.verify(x => x(1, 2, 3), Times.exactly(2));
        });

        it('should check that global type is auto sandboxed', () => {

            const mock = GlobalMock.ofType(GlobalBar, container);

            mock.verify(x => x.value, Times.never());

            GlobalScope.using(mock).with(() => {

                const bar1 = new container.GlobalBar();

                bar1.value;
                bar1.value;

                mock.verify(x => x.value, Times.exactly(2));

            });

            const bar2 = new container.GlobalBar();

            bar2.value;

            mock.verify(x => x.value, Times.exactly(2));
        });

        it('should check that \'XmlHttpRequest\' global object is auto sandboxed', () => {

            const mock = GlobalMock.ofType(XMLHttpRequest, container);

            mock.verify(x => x.send(It.isAny()), Times.never());

            GlobalScope.using(mock).with(() => {

                const xhr1 = new container.XMLHttpRequest();

                xhr1.open('GET', 'http://www.typescriptlang.org', true);
                xhr1.send();
                xhr1.open('GET', 'http://www.typescriptlang.org', true);
                xhr1.send();

                mock.verify(x => x.send(), Times.exactly(2));

            });

            const xhr2 = new container.XMLHttpRequest();

            xhr2.open('GET', 'http://www.typescriptlang.org', true);
            xhr2.send();

            mock.verify(x => x.send(), Times.exactly(2));
        });

        it('should check that \'localStorage\' global object is auto sandboxed', () => {

            if (typeof localStorage == 'undefined' ||
                typeof (<any>localStorage).getItem != 'function') {
                console.log('global \'localStorage\' object not available');
            } else {
                const mock = GlobalMock.ofInstance(localStorage, 'localStorage', container);

                mock.setup(x => x.getItem(It.isAnyString())).returns((key: string) => '[]');

                GlobalScope.using(mock).with(() => {

                    expect(localStorage.getItem('xyz')).toEqual('[]');

                    mock.verify(x => x.getItem(It.isAnyString()), Times.exactly(1));

                });

                localStorage.setItem('xyz', 'Lorem ipsum dolor sit amet');

                expect(localStorage.getItem('xyz')).toEqual('Lorem ipsum dolor sit amet');

                mock.verify(x => x.getItem(It.isAnyString()), Times.exactly(1));
            }

        });

        describe('dynamic mock', () => {

            it('should check that global type is auto sandboxed', () => {

                if (!hasProxyES6) {
                    console.log(noProxyES6Msg);
                } else {
                    const mock = GlobalMock.ofType2<GlobalBar>('GlobalBar', container);

                    mock.verify(x => x.value, Times.never());

                    GlobalScope.using(mock).with(() => {

                        const bar1 = new container.GlobalBar();

                        bar1.value;
                        bar1.value;

                        mock.verify(x => x.value, Times.exactly(2));

                    });

                    const bar2 = new container.GlobalBar();

                    bar2.value;

                    mock.verify(x => x.value, Times.exactly(2));

                }
            });

            it('should check that \'XmlHttpRequest\' global object is auto sandboxed', () => {

                if (!hasProxyES6) {
                    console.log(noProxyES6Msg);
                } else {
                    const mock = GlobalMock.ofType2<XMLHttpRequest>('XMLHttpRequest', container);

                    mock.verify(x => x.send(It.isAny()), Times.never());

                    GlobalScope.using(mock).with(() => {

                        const xhr1 = new container.XMLHttpRequest();

                        xhr1.open('GET', 'http://www.typescriptlang.org', true);
                        xhr1.send();
                        xhr1.open('GET', 'http://www.typescriptlang.org', true);
                        xhr1.send();

                        mock.verify(x => x.send(), Times.exactly(2));

                    });

                    const xhr2 = new container.XMLHttpRequest();

                    xhr2.open('GET', 'http://www.typescriptlang.org', true);
                    xhr2.send();

                    mock.verify(x => x.send(), Times.exactly(2));
                }
            });

        });

    });

});
