import { module } from '../module';
import { IActionModel } from '../models/action.model';
import * as _ from 'lodash';

const _dirName = 'fxDialogFormAction';

class Controller {
    static $inject = ["$scope", "fxAction", "materialUtils", "toolbarUtils", "$mdDialog"];

    private submitCallBack: Function;

    formData: Object;
    actionModel: IActionModel;
    toolbars: Array<any>;
    key: string;
    isBusy: boolean;

    constructor(private $scope, private fxAction, private materialUtils: fx.utils.materialStatic, private toolbarUtils, private $mdDialog: ng.material.IDialogService) {
        // this.formData = this.formData;
    }

    doSubmit($form) {
        let promise = this.fxAction.doAction(this.key, this.formData, $form);

        if (promise) {
            this.isBusy = true;
            promise.then((result) => {
                this.actionModel.closeDialog === true && this.$mdDialog.hide(result);
                if (_.isFunction(this.submitCallBack)) {
                    this.submitCallBack(result);
                }
            }).finally(() => {
                this.isBusy = false;
            });
        }

        return promise;
    }

    getActionModel() {
        this.fxAction.getModel(this.key).then((model) => {
            this.actionModel = model;
            this.toolbars = [
                this.toolbarUtils.noneBuilder("icon").iconBuilder(this.actionModel.icon).toValue(),
                this.toolbarUtils.labelBuilder(this.actionModel.title).attrBuilder({ flex: "" }).toValue(),
                this.toolbarUtils.btnBuilder("关闭", "md-icon-button", false).iconBuilder("close").btnClick(($event) => {
                    this.$mdDialog.cancel();
                }).toValue()
            ];
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
        template: require("../tpls/form-dialog.jade")(),
        scope: true,
        require: `^${_dirName}`,
        bindToController: {
            key: "@",
            formData: '=ngModel',
            submitCallBack: '=?ngSubmit'
        },
        controller: Controller,
        controllerAs: 'dialogFormCtl',
        replace: false,
        compile: ($ele) => {
            $ele.replaceWith(angular.element($ele.html()));
            return ($scope, $ele: ng.IAugmentedJQuery, $attrs, $ctl: Controller) => {
                $scope.$watch(() => {
                    return $ctl.key;
                }, () => {
                    $ctl.getActionModel();
                });
            };
        }
    };
}

module.directive(_dirName, Directive);

