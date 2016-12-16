import { module } from '../module';
import { IActionModel } from '../models/action.model';

const _dirName = 'fxDialogWizardAction';

class Controller {
    static $inject = ["$scope", "fxAction", "materialUtils", "toolbarUtils", "$mdDialog"];

    formData: Object;
    actionModel: IActionModel;
    key: string;
    toolbars: Array<any>;
    submitCallBack: Function;

    constructor(private $scope, private fxAction, private materialUtils: fx.utils.materialStatic, private toolbarUtils, private $mdDialog: ng.material.IDialogService) {
        //this.formData = this.formData ;
    }

    getActionModel() {
        this.fxAction.getModel(this.key).then((model) => {
            this.actionModel = model;
            this.toolbars = [
                this.toolbarUtils.noneBuilder("icon").iconBuilder(this.actionModel.icon).toValue(),
                this.toolbarUtils.labelBuilder(this.actionModel.title).attrBuilder({ flex: "" }).toValue(),
                this.toolbarUtils.btnBuilder("关闭", "md-icon-button", false).iconBuilder("close").btnClick(($event) => {
                    this.$mdDialog.cancel("用户关闭");
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
        template: require("../tpls/wizard-dialog.jade")(),
        scope: true,
        require: `^${_dirName}`,
        bindToController: {
            key: "@",
            formData: '=ngModel',
            submitCallBack: "=?ngSubmit",
        },
        controller: Controller,
        controllerAs: 'dialogWizardCtl',
        replace: false,
        compile: ($ele) => {
            $ele.replaceWith(angular.element($ele.html()));
            return ($scope, $ele: ng.IAugmentedJQuery, $attr, $ctl: Controller) => {
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

