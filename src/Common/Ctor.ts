export type Ctor<T> = {
    new (): T;
    prototype: Object;
}

export type ConstructorWithArgs<T> = {
    new (...constructorArgs: any[]): T;
    prototype: Object;
}
