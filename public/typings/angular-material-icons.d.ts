declare module 'angular-material-icons' {
    var _: string;
    export = _;
}

declare module ngMdIcon {
    interface service {
        getShape(name: string): string;
        getShapes(): Array<string>;
        getViewBox(name: string): string;
        getViewBoxes(): Array<string>;
        setShape(name: string, shape: string): service;
        setShapes(): service;
        setViewBox(): service;
        setViewBoxes(): service;
        addShape(name: string, shape: string): service;
        addShapes(newShapes: Array<{(key: string): string}>): service;
        addViewBox(name: string, viewBox: string): service;
        addViewBoxes(newViewBoxes: Array<{(key: string): string}>): service;
    }
}