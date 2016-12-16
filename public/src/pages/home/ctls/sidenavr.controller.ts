/**
 * Created by NICK on 16/8/10.
 */

export class SidenavRightController {
    public static $inject = ["$mdColorPalette", "fxAction"];

    colors: Array<string>;

    constructor(private $mdColorPalette: ng.material.IColorPalette, private fxAction) {
        this.colors = Object.keys($mdColorPalette);
    }

    selectTheme(color) {
        console.log(color);
    }

    showTheme($event) {
        console.log($event);
    }

    /**
     * 退出登录
     * @param $event
     */
    doExit($event: MouseEvent) {
        this.fxAction.getModel('logout').then((model)=> {
            const promise = this.fxAction.doActionModel($event, model);

            if (promise) {
                promise.then(()=> {
                    console.log("logout");
                });
            }
        });
    }
}

