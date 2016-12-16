import { module } from '../module';
import { IActionModel, ActionType } from '../models/action.model';
import { MethodType } from '../models/interface.model';

/**
 * 模块查询
 */
class List {
    static $inject = ["toolbarUtils", "actionUtils"];
    static key: string = "module";

    constructor(toolbarUtils, actionUtils) {
        let actionModel: IActionModel = {
            key: List.key,
            type: ActionType.list,
            title: "模块管理",
            icon: "view-module",
            list: {
                columns: [
                    actionUtils.columnBuilder("<span>{{::item.key}}</span>", "KEY").toValue(),
                    actionUtils.columnBuilder("<span>{{ ::item.title }}</span>", "模块名称").toValue(),
                    actionUtils.columnBuilder(`<ng-md-icon icon="{{ ::item.icon }}"></ng-md-icon>`, "图标").toValue(),
                    actionUtils.columnBuilder(`<span>{{ ::item.lft }}</span>`, "lft", "lft").toValue(),
                    actionUtils.columnBuilder(`<span>{{ ::item.rgt }}</span>`, "rgt", "rgt").toValue()
                ],
                // 每页显示数量
                queryData: { limit: 50 },
                showPagination: true,
                searchActionKey: Search.key,
                showRefreshBtn: true,
                showSearchBtn: true,
                showSearchPanel: false,
                toolbars: [],
                itemToolbars: []
            },
            itemActions: [{ key: Edit.key }, { key: Delete.key }],
            actions: [Add.key],
            interfaces: [{
                key: "modulesList",
                method: MethodType.GET,
                address: "",
                port: null,
                path: "modules",
                jpp: {
                    set: [{ "from": "/total", "to": "/count" }, { "from": "/rows", "to": "/rows" }]
                },
                isRestful: true
            }]
        };

        return actionModel;
    }
}
/**
 * 模块侧边栏
 */
class Menus {
    static $inject = ["toolbarUtils", "actionUtils"];
    static key: string = "moduleMenuAction";

    constructor(toolbarUtils, actionUtils) {
        let actionModel: IActionModel = {
            key: Menus.key,
            type: ActionType.list,
            title: "模块管理",
            icon: "view-module",
            interfaces: [{
                key: "moduleMenu",
                method: MethodType.GET,
                address: "",
                port: null,
                path: "/modules/menu",
                isRestful: false
            }]
        };

        return actionModel;
    }
}
/**
 * 模块增加
 */
class Add {
    static $inject = ["toolbarUtils", "actionUtils"];
    static key: string = "modulesAddAction";

    constructor(toolbarUtils, actionUtils) {
        let actionModel: IActionModel = {
            key: Add.key,
            type: ActionType.form,
            title: "新建模块",
            icon: "add",
            refreshList: true,
            form: {
                dataSchema: "moduleActionData",
                formSchema: "moduleAddActionForm"
            },
            closeDialog: true,
            interfaces: [{
                key: "modulesAdd",
                method: MethodType.POST,
                address: "",
                port: null,
                path: "modules",
                isRestful: true
            }]
        };

        return actionModel;
    }
}
/**
 * 模块修改
 */
class Edit {
    static $inject = ["toolbarUtils", "actionUtils"];
    static key: string = "modulesEditAction";

    constructor(toolbarUtils, actionUtils) {
        let actionModel: IActionModel = {
            key: Edit.key,
            type: ActionType.form,
            title: "修改模块",
            icon: "edit",
            refreshList: true,
            form: {
                dataSchema: "moduleActionData",
                formSchema: "moduleEditActionForm"
            },
            closeDialog: true,
            interfaces: [{
                key: "modulesEdit",
                method: MethodType.PUT,
                idFieldPath: "/id",
                address: "",
                port: null,
                path: "modules",
                isRestful: true
            }]
        };

        return actionModel;
    }
}
/**
 * 模块删除
 */
class Delete {
    static key: string = "modulesDeleteAction";

    constructor() {
        let actionModel: IActionModel = {
            key: Delete.key,
            type: ActionType.confirm,
            title: "删除模块",
            icon: "delete",
            refreshList: true,
            confirm: {
                confirmTitle: "",
                confirmContent: "确定要删除模块吗!"
            },
            interfaces: [{
                key: "modulesDelete",
                method: MethodType.DELETE,
                idFieldPath: "/id",
                address: "",
                port: null,
                path: "modules",
                isRestful: true
            }]
        };

        return actionModel;
    }
}
/**
 * 模块搜索
 */
class Search {
    static $inject = ["toolbarUtils", "actionUtils"];
    static key: string = "modulesSearchAction";

    constructor() {
        let actionModel: IActionModel = {
            key: Search.key,
            icon: "search",
            type: ActionType.form,
            title: "模块搜索表单",
            form: {
                dataSchema: "moduleActionData",
                formSchema: "moduleSearchActionForm"
            }
        };

        return actionModel;
    }
}

const services: Array<any> = [Delete, Menus, List, Search, Add, Edit];

_.each(services, (ser) => {
    module.service(ser.key, ser);
});

