declare module 'fxMaterialModule' {
    var _: string;
    export = _;
}

declare namespace fx.utils {
    interface materialStatic {
        preventDefault($event: MouseEvent): void;
        stopPropagation($event: MouseEvent): void;
        stopAll($event: MouseEvent): void;
        close(): void;
        safeApply($scope: angular.IScope, applyFn: any): void;
        alert(title: string, content?: string): ng.IPromise<any>;
        showErrMsg(msg: string): ng.IPromise<any>;
        showMsg(msg: string): ng.IPromise<any>;
        openMenu($mdOpenMenu: Function, $event: MouseEvent): void;
        buildToggle(navId: string): Function;
    }

}