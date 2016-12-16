/**
 * Created by NICK on 16/8/17.
 */

/**
 * 登陆controller
 */
export class LoginController {
    static $inject = ["$rootScope", "$state", "fxAction", "materialUtils"];

    key: string = "login";
    formData: Object = { username: "nick", password: "nick" };

    constructor(private $rootScope: angular.IRootScopeService, private $state: ng.ui.IStateService, private fxAction, private materialUtils: fx.utils.materialStatic) {
    }

    /**
     * 登陆,触发登陆操作
     * @param form 表单
     */
    doSubmit($form: ng.IFormController) {
        let promise: ng.IPromise<any> = this.fxAction.doAction(this.key, this.formData, $form);

        promise && promise.then((user) => {
            this.$rootScope.$emit('$stateRefresh');
            this.materialUtils.showMsg("登陆成功,正在跳转!");
            this.$state.go("home");
            this.$rootScope['user'] = user.loginAction.username;
        });
    }
}