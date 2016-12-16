declare namespace JppJS {
    interface Jpp {
        value(path?:string):any;
        get(path):Jpp;
        set(path:string, value:any, create:boolean):Jpp;
        copy(from:string, to:string, skip:boolean):Jpp;
        del(path:string):Jpp;
        move(from:string, to:string):Jpp;
        range(path, ...args:any[]):Jpp;
        find(path:string, ...args:any[]):Jpp;
        findLast(path:string, ...args:any[]):Jpp;
        each(path:string, cb:Function):Jpp;
        forIn(path:string, cb:Function):Jpp;
        filter(path:string, cb:Function):Jpp;
        concat(...path:string[]):Jpp;
    }

    interface JppStatic {
        (obj:Object):Jpp;
        (obj:Object, path:string):any;
    }
}

declare module "jsonPathProcessor" {
    let jsonPathProcessor:JppJS.JppStatic;
    namespace jsonPathProcessor {}
    export = jsonPathProcessor;
}