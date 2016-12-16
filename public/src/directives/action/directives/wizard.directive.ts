import { module } from '../module';
import { IActionModel, ISchemaForm, ActionType } from '../models/action.model';

interface IDirectiveScope extends ng.IScope {

}

interface IDirectiveAttr extends ng.IAttributes {

}

class Controller {
    static $inject = ["$scope", "$timeout", "fxAction", "toolbarUtils", "materialUtils", "$mdDialog"];

    isShow: boolean = true;
    actionModel: IActionModel;
    key: string;
    formData: Object;
    selectedIndex: number = 0;
    toolbars: Array<any>;
    $forms: { [id: string]: ng.IFormController };
    isBusy: boolean;
    submitCallBack: Function;

    constructor(private $scope, private $timeout, private fxAction, private toolbarUtils, private materialUtils: fx.utils.materialStatic, private $mdDialog) {
        this.initToolbar();

        this.$scope.$on("$destroy", () => {
            this.formData = null;
            this.$forms = null;
            this.toolbars = null;
            this.actionModel = null;
        });
    }

    /**
     * 初始化form，因为有多个form，所以需要用一个对象来保存所有的表单对象，用于后期验证表单的$valid
     * @param action
     * @param $scope
     */
    initForm(action: IActionModel, $scope: ng.IScope) {
        if (!this.$forms) {
            this.$forms = {};
        }
        this.$forms[action.key] = $scope[`${action.key}Form`];
    }

    /**
     * 判断是否需要显示form,默认只有第一页和最后一页首次加载
     * @param action
     * @param index
     * @returns {boolean}
     */
    showForm(action: IActionModel, index: number) {
        return index === 0 || this.$forms.hasOwnProperty(action.key) || index == this.selectedIndex || index == this.actionModel.wizard.actions.length - 1;
    }

    /**
     * 验证当前表单是否正确
     * @returns {boolean}
     */
    doCheckCurrentForm(index?: number) {
        let actionModel = this.actionModel.wizard.actions[_.isUndefined(index) ? this.selectedIndex : index];

        // 验证表单是否正确
        if (this.$forms) {
            let formController = this.$forms[`${(actionModel as IActionModel).key}`];

            if (!this.fxAction.doFormCheck(formController)) {
                return false;
            }
        }

        return true;
    }

    /**
     * 检查所有的表单是否正确
     * @returns {boolean}
     */
    doCheckForms() {
        let res = true;

        _.each(this.actionModel.wizard.actions, (action, index) => {
            res = this.doCheckCurrentForm(index);

            if (!res) {
                this.selectedIndex = index;
                return false;
            }
        });

        return res;
    }

    /**
     * 重置表单数据
     */
    reset() {
        this.formData = {};
        this.$forms = {};
        this.selectedIndex = 0;
        this.isShow = false;
        this.$timeout(() => {
            this.isShow = true;
        }, 0);
    }

    /**
     * 添加wizard的按钮组,包括上一步,下一步和完成按钮
     * 每个按钮都需要验证表单的正确性
     * 每个按钮如果有接口操作,都需要调用接口,接口返回正常才可用
     */
    initToolbar() {
        this.toolbars = [
            this.toolbarUtils.btnBuilder("上一步", null, true, "top").iconBuilder("navigate_before").conditionBuilder("wizardCtl.selectedIndex>0", false).btnClick(($event) => {
                this.selectedIndex && this.selectedIndex--;
            }).toValue(),
            this.toolbarUtils.btnBuilder("下一步", null, true, "top").iconBuilder(null, null, "navigate_next").conditionBuilder("wizardCtl.selectedIndex < wizardCtl.actionModel.wizard.actions.length-1", false).btnClick(($event) => {
                if (this.doCheckCurrentForm() && _.isArray(this.actionModel.wizard.actions) && this.actionModel.wizard.actions.length > this.selectedIndex) {
                    this.selectedIndex++;
                }
            }).toValue(),
            this.toolbarUtils.btnBuilder("完成", "md-primary", true, "top").iconBuilder("done_all").conditionBuilder("!wizardCtl.isBusy && wizardCtl.selectedIndex===wizardCtl.actionModel.wizard.actions.length-1", false).btnClick(($event) => {
                if (this.doCheckForms()) {
                    this.isBusy = true;
                    this.fxAction.doAction(this.actionModel.key, this.formData).then((result) => {
                        this.actionModel.closeDialog === true && this.$mdDialog.hide(result);

                        if (_.isFunction(this.submitCallBack)) {
                            this.submitCallBack(result);
                        }
                        // this.materialUtils.showMsg(this.actionModel.successMsg || "操作成功！");
                        // this.reset();
                    }).finally(() => {
                        this.isBusy = false;
                    });
                }
            }).toValue()
        ];
    }

    /**
     * 通过key来获取数据
     */
    getActionModel() {
        let actionModel;

        this.fxAction.getModel(this.key).then((model: IActionModel) => {
            actionModel = _.cloneDeep(model);

            return this.fxAction.getModels(model.wizard.actions);
        }).then((actionModels: Array<IActionModel>) => {
            let actions = [];

            _.each(actionModel.wizard.actions, (action) => {
                if (_.isString(action)) {
                    action = actionModels[action];
                }
                // 如果是form/wizard的话，判断dataSchema是否存在，不存在则使用wizard的defaultSchema
                if (action && (action.type === ActionType.form || action.type === ActionType.wizard)) {
                    // if (!action.form.dataSchema && action.type === ActionType.form) {
                    //     action.form.dataSchema = actionModel.wizard.defaultSchema.dataSchema;
                    // }
                    actions.push(action);
                }
            });
            actionModel.wizard.actions = actions;
            this.actionModel = actionModel;
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
        template: require("../tpls/wizard.jade")(),
        scope: true,
        require: "^fxWizardAction",
        bindToController: {
            formData: "=ngModel",
            submitCallBack: "=?ngSubmit",
            key: "@"
        },
        controller: Controller,
        controllerAs: 'wizardCtl',
        replace: true,
        transclude: true,
        link: ($scope: IDirectiveScope, $ele: ng.IAugmentedJQuery, $attr: IDirectiveAttr, $ctl: Controller) => {
            $scope.$watch(() => {
                return $ctl.key;
            }, () => {
                $ctl.getActionModel();
            });
        }
    };
}
module.directive("fxWizardAction", Directive);
