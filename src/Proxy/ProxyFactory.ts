import { ICallInterceptor } from './ICallInterceptor';
import { ProxyES5 } from './ProxyES5';
import { ProxyES6 } from './ProxyES6';
import { ProxyES6Handler } from './ProxyES6Handler';

export class ProxyFactory {

    static createProxy<T>(target: T, interceptor: ICallInterceptor): T {
        const proxy: T = <T><any>ProxyES5.of(target, interceptor);
        return proxy;
    }

    static createProxyES6<T extends object>(target: T, interceptor: ICallInterceptor): T {
        const proxyHandler: ProxyES6Handler<T> = new ProxyES6Handler(interceptor);
        const proxy: T = <T><any>ProxyES6.of(target, proxyHandler);
        return proxy;
    }
}
