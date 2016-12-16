import {IActionModel, ActionType} from '../../../directives/action/models/action.model';
import {MethodType} from '../../../directives/action/models/interface.model';

/**
 * 返回用户登录界面的schema
 * @returns {IActionModel}
 * @constructor
 */
function LoginSchemaValue() {
    let actionModel: IActionModel = {
        key: "login",
        type: ActionType.form,
        icon: "",
        form: {
            dataSchema: {
                type: "object",
                required: ["username", "password"],
                properties: {
                    username: {
                        type: "string",
                        minLength: 4,
                        maxLength: 20,
                        title: "用户名"
                    },
                    password: {
                        type: "string",
                        title: "密码",
                        minLength: 4,
                        maxLength: 20
                    }
                }
            },
            formSchema: [{
                key: "username",
                type: "string",
                placeHolder: "用户名",
                icon: {
                    leftIcon: "account"
                },
                htmlClass: "md-icon-left md-block"
            }, {
                key: "password",
                type: "password",
                icon: {
                    leftIcon: "lock"
                },
                htmlClass: "md-icon-left md-block"
            }]
        },
        interfaces: [{
            key: "loginAction",
            method: MethodType.POST,
            address: "",
            port: null,
            path: "/passport/login",
            isRestful: false
        }]
    };

    return actionModel;
}

function LogoutSchemaValue() {
    let actionModel: IActionModel = {
        key: "logout",
        type: ActionType.confirm,
        icon: "",
        confirm: {
            confirmTitle: '用户中心',
            confirmContent: '确定要退出么?',
            confirmOk: "果断退出",
            confirmCancel: '在看看'
        },
        interfaces: [{
            key: "logoutAction",
            method: MethodType.POST,
            address: "",
            port: null,
            path: "/passport/logout",
            isRestful: false
        }]
    };

    return actionModel;
}

export default (module: ng.IModule)=> {
    const models = [LoginSchemaValue(), LogoutSchemaValue()];

    _.each(models, (model)=> {
        module.value(model.key, model);
    });
}
