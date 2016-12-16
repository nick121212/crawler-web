import { module } from '../module';
import { IActionModel, ActionType } from '../models/action.model';
import * as _ from 'lodash';

const _name = "fxBuilderAction";

class Controller {
    static $inject = ["fxAction", "toolbarUtils"];

    key: string;
    formData: any;
    actionModel: IActionModel;

    constructor(private fxAction, private toolbarUtils) {
        this.formData = this.formData || {};
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
        template: require("../tpls/builder.jade")(),
        bindToController: {
            formData: "=ngModel",
            key: "@"
        },
        require: `^${_name}`,
        controller: Controller,
        controllerAs: 'formBuilderCtl',
        replace: true
    };

}

Directive.$inject = [];

module.directive(_name, Directive);

