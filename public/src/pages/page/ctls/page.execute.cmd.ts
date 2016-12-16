
import { IActionModel, ActionType, IClientData } from '../../../directives/action/models/action.model';
import { ExecuteCmdForm } from '../services/execute.cmd';
import * as _ from 'lodash';

export class PageExecuteCmdController {
    static $inject = ["$rootScope", "$stateParams", "$timeout", "materialUtils", "fxAction", "toolbarUtils"];

    key: string;
    toolbars: Array<any>;
    actionModel: IActionModel;
    formData: any;
    isBusy: boolean;
    executeResult: any = {};

    constructor(private $rootScope: angular.IRootScopeService, private $stateParams: ng.ui.IStateParamsService, private $timeout, private materilUtils: fx.utils.materialStatic, private fxAction, private toolbarUtils) {
        this.key = ExecuteCmdForm.key;
        this.doInitToolbar();
        this.formData = {
            listIps: []
        };
    }

    doInitToolbar() {
        this.toolbars = [
            this.toolbarUtils.noneBuilder("icon").iconBuilder('apple-keyboard-command', {}).toValue(),
            this.toolbarUtils.labelBuilder('执行命令').attrBuilder({ flex: "" }).toValue()
        ];
    }

    doSubmit($event, form) {
        let promise = this.fxAction.doAction(this.key, this.formData, form);
        let results;

        if (promise) {
            this.isBusy = true;
            promise.then((res) => {
                this.materilUtils.showMsg("执行命令成功！");
                results = res;

                return this.fxAction.getModel(this.key);
            }).then((actionModel) => {
                this.actionModel = actionModel;

                return this.fxAction.doDealResult(actionModel, results, this.executeResult);
            }).then((res) => {
                this.$rootScope.$broadcast("showExecuteCmdResult", res.data.cmdid);
            }).finally(() => {
                this.isBusy = false;
            });
        }
    }
}