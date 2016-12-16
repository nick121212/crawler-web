declare module 'fxRestModule' {
    var _: string;
    export = _;
}

declare namespace fx.utils {
    interface restStatic {
        params: Object;
        headers: Object;
        setConfig(fn: Function): any;
        getRestAngular(router: string, unique?: boolean, baseUrl?: string): restangular.ICollection;
        getCustom(address: string, port: number, path: string): restangular.ICollection;
        getCustomRestful(address: string, port: number, path: string): restangular.ICollection;
    }
    interface rest {
        new(baseUrl: string): restStatic;
    }
}