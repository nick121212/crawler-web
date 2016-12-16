import { module } from '../module';
import { IActionModel, ActionType } from '../models/action.model';
import * as pointer from 'json-pointer';
import * as _ from 'lodash';

interface IDirectiveScope extends ng.IScope {

}

interface IDirectiveAttr extends ng.IAttributes {

}

class Controller {
    static $inject = ["$scope", "fxAction"];

    actionModel: IActionModel;
    key: string;
    ngModel: Object;
    formData: Object;
    isBusy: boolean;

    constructor(private $scope, private fxAction) {
        this.$scope.$on("$destroy", () => {
            this.formData = null;
            this.actionModel = null;
            this.ngModel = null;
        });
        if (this.actionModel) {
            this.getModelData(this.actionModel);
        }
    }

    getModelData(actionModel: IActionModel) {
        // 取得数据中的特定部分
        if (actionModel.type === ActionType.form && actionModel.form) {
            if (pointer.has(this.ngModel, actionModel.form.path || "")) {
                this.formData = pointer.get(this.ngModel, actionModel.form.path || "");
            }
        }
        !this.formData && (this.formData = {});
    }

    getActionModel() {
        this.isBusy = true;
        this.fxAction.getModel(this.key).then((actionModel: IActionModel) => {
            this.getModelData(actionModel);
            return this.fxAction.getSchema(actionModel);
        }).then((model) => {
             this.actionModel = model;
        }).then(()=>{
            return this.fxAction.doAction(this.key,this.formData,null,"open");
        }).then((results)=>{
           this.formData =  this.fxAction.doDealResult(this.actionModel,results,this.formData);
           console.log(this.formData);
        }).finally(() => {
            this.isBusy = false;
        });
    }
}

/**
 * 操作指令,某个表单操作
 * @returns {{restrict: string, template: any, scope: {}, replace: boolean, link: (($scope:IDirectiveScope))}}
 * @constructor
 */
function Directive(): ng.IDirective {
    return {
        restrict: 'EA',
        template: require("../tpls/form.jade")(),
        scope: true,
        require: "^fxFormAction",
        bindToController: {
            ngModel: "=ngModel",
            actionModel: "=?",
            isBusy: "=?ngDisabled",
            key: "@?"
        },
        controller: Controller,
        controllerAs: 'formCtl',
        replace: true,
        transclude: true,
        link: ($scope: IDirectiveScope, $ele: ng.IAugmentedJQuery, $attrs: IDirectiveAttr, $ctl: Controller) => {
            $scope.$watch(() => {
                return $ctl.key;
            }, (newValue) => {
                newValue && $ctl.getActionModel();
            });
        }
    };
}

module.directive("fxFormAction", Directive);
