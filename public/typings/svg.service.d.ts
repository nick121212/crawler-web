declare module 'fxSvgModule' {
    var _: string;
    export = _;
}

declare namespace fx.utils {
    interface svgStatic {
        getAllIcons(): Array<any>;
        loadSvgUrl(url: string): ng.IPromise<any>;
    }
}