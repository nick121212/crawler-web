import * as mdl from '../module';
import { IActionModel, ActionType, IClientData } from "../models/action.model";
import { IInterfaceModel, MethodType } from "../models/interface.model";
import * as pointer from 'json-pointer';
import * as _ from 'lodash';

class DialogController {
    static $inject = ["$scope", "item", "key", "submit"];

    constructor(private $scope, private item, private key, private submit) {
        // console.log(arguments);
    }
}

class Provider {
    static $inject = ["$rootScope", "$injector", "restUtils", "materialUtils", "$q", "$mdDialog"];

    static _name: string = 'fxAction';

    constructor(private $rootScope: ng.IRootScopeService, private $injector: ng.auto.IInjectorService, private restUtils: fx.utils.restStatic, private mdUtils: fx.utils.materialStatic, private $q: ng.IQService, private $mdDialog: ng.material.IDialogService) {
        return this;
    }

    $get: Array<string | Function> = ["$injector", ($injector) => {
        const service = $injector.invoke(Provider, this, null);

        return new Provider(service.$rootScope, service.$injector, service.restUtils, service.mdUtils, service.$q, service.$mdDialog);
    }];


    getInjector(key: string) {
        if (this.$injector.has(key)) {
            return _.cloneDeepWith(this.$injector.get(key));
        }
        return null;
    }

    /**
     * 从数据库中获取model
     */
    getModelFromServer(key: string) {
        const defer = this.$q.defer();
        const config = this.$rootScope["config"] || {};

        this.getModel("actionCommonfx-1").then((actionModel: IActionModel) => {
            this.doAction(actionModel.key, {
                key: key
            }).then((results: any) => {
                let resource = { rows: [] };

                this.doDealResult(actionModel, results, resource);
                if (resource.rows && resource.rows.length) {
                    config.env === "production" && mdl.module.value(key, resource.rows[0]);
                    return defer.resolve(resource.rows[0]);
                }
                // this.mdUtils.showErrMsg(`没有找到key[${key}]!`);
                defer.reject(key);
            });
        }).catch(defer.reject);

        return defer.promise;
    }

    /**
     * 查找操作模型,如果本地没有,则去服务器中查找
     * @param key  {String}  操作的KEY
     * @returns {IPromise<T>}
     */
    getModel(key: string) {
        const defer = this.$q.defer();

        if (!key) {
            defer.reject();
        } else {
            // 先从注入器中查找
            if (this.$injector.has(key)) {
                defer.resolve(_.cloneDeepWith(this.$injector.get(key)));
            } else {
                // 从当前module的注入器中查找
                if (angular.injector([mdl.module.name]).has(key)) {
                    defer.resolve(angular.injector([mdl.module.name]).get(key));
                }
                else {
                    // 从接口中查找
                    return this.getModelFromServer(key);
                }
            }
        }

        return defer.promise;
    }

    /**
     * 查找操作模型中的formSchema
     * @param actionModel
     * @returns {IPromise<T>}
     */
    getSchema(actionModel: IActionModel) {
        let keys = [], defer = this.$q.defer(), schemaActionModel;

        if (actionModel.type === ActionType.form) {
            _.isString(actionModel.form.dataSchema) && keys.push(actionModel.form.dataSchema);
            _.isString(actionModel.form.formSchema) && keys.push(actionModel.form.formSchema);
        }

        if (keys.length) {
            this.getModel("schemaCommonfx-1").then((model: IActionModel) => {
                schemaActionModel = model;
                return this.doAction(model.key, {
                    limit: keys.length,
                    where: {
                        "key": {
                            "$in": keys
                        }
                    }
                });
            }).then((results) => {
                const data = this.doDealResult(schemaActionModel, results, {});
                const schemas = _.keyBy(data.rows, "key");

                if (actionModel.type === ActionType.form) {
                    if (_.isString(actionModel.form.dataSchema) && schemas[actionModel.form.dataSchema.toString()]) {
                        actionModel.form.dataSchema = schemas[actionModel.form.dataSchema.toString()]["text"];
                    }
                    if (_.isString(actionModel.form.formSchema) && schemas[actionModel.form.formSchema.toString()]) {
                        actionModel.form.formSchema = schemas[actionModel.form.formSchema.toString()]["textForm"];
                    }
                }
            }).finally(() => {
                defer.resolve(actionModel);
            });
        } else {
            defer.resolve(actionModel);
        }

        return defer.promise;
    }

    /**
     * 查找操作模型数组,如果本地没有,则去服务器中查找
     * @param keys
     * @returns {IPromise<T>}
     */
    getModels(keys: Array<string | IActionModel>) {
        const defer = this.$q.defer();
        const actionModels = {};
        const notFoundsKeys = [];
        const promises: { [id: string]: ng.IPromise<any> } = {};

        _.each(keys, (key) => {
            if (_.isObject(key)) {
                actionModels[(key as IActionModel).key] = key;
            }
            else {
                promises[key as string] = this.getModel(key as string).then((actionModel) => {
                    actionModels[key as string] = actionModel;
                }).catch((key) => {
                    notFoundsKeys.push(key);
                });
            }
        });

        this.$q.all(promises).then(() => {
            defer.resolve(actionModels);
        }).catch(() => {
            defer.resolve(actionModels);
        });

        return defer.promise;
    }

    /**
     * 执行弹窗表单操作
     * @param $event
     * @param actionModel
     * @param item
     * @return {Promise<any>}
     */
    doActionModel($event: MouseEvent, actionModel: IActionModel, item?: any, callback?: Function): ng.IPromise<any> {
        // 表单和多级表单操作,弹出dialog
        // 确认框操作,弹出确认窗口
        switch (actionModel.type) {
            case ActionType.wizard:
            case ActionType.form:
                const templates = {
                    [ActionType.form]: require("../tpls/form-dialog-action.jade")(),
                    [ActionType.wizard]: require("../tpls/wizard-dialog-action.jade")()
                };

                return this.$mdDialog.show({
                    targetEvent: $event,
                    clickOutsideToClose: false,
                    escapeToClose: false,
                    fullscreen: true,
                    preserveScope: false,
                    autoWrap: false,
                    locals: {
                        'item': _.cloneDeep(item || {}),
                        'key': actionModel.key,
                        'submit': callback
                    },
                    controller: DialogController,
                    controllerAs: "dialogCtl",
                    template: templates[actionModel.type]
                }).then(() => {
                    item = null;
                    console.log("关闭");
                });
            case ActionType.confirm:
                const confirm = this.$mdDialog.confirm()
                    .title(actionModel.confirm.confirmTitle)
                    .textContent(actionModel.confirm.confirmContent)
                    .ariaLabel(actionModel.confirm.confirmTitle)
                    .targetEvent($event)
                    .ok(actionModel.confirm.confirmOk || "确定")
                    .cancel(actionModel.confirm.confirmCancel || "取消");

                return this.$mdDialog.show(confirm).then(() => {
                    return this.doAction(actionModel.key, item).then((results) => {
                        _.isFunction(callback) && callback(results);
                    });
                });
        }

        return null;
    }

    /**
     * 检测表单是否合法
     * @param $form
     * @returns {boolean}
     */
    doFormCheck($form) {
        if ($form) {
            this.$rootScope.$broadcast("schemaFormValidate");
            if (!$form.$valid) {
                console.log($form.$error);
                this.mdUtils.showErrMsg("表单没有填写正确!");
                return false;
            }
        }

        return true;
    }

    /**
     * 处理接口的数据,数据的互相拷贝
     * @param actionModel
     * @param results
     * @param clientData
     * @param key
     * @return {IClientData}
     */
    doDealResult(actionModel: IActionModel, results: Object, clientData: IClientData, key: string = 'jpp') {
        _.forEach(actionModel.interfaces, (iInterface) => {
            let result = results[iInterface.key];
            let jpp = iInterface[key];

            if (result && jpp) {
                // 接口数据拷贝到本地
                _.each(jpp.set, (val) => {
                    pointer.has(result, val.from || "") && pointer.set(clientData, val.to || "", pointer.get(result, val.from || ""));
                });
                // 本地数据的删除
                _.isArray(jpp.del) && _.each(jpp.del, (val) => {
                    pointer.has(clientData, val) && pointer.remove(clientData, val);
                });
            }
        });

        return clientData;
    }

    /**
     * 设置请求的参数路劲
     */
    private doGetField(restAngular: restangular.ICollection, queryDataCline: any, interfaceModel: IInterfaceModel, defaults: Array<string> = []) {
        let idFieldPaths = (!_.isArray(interfaceModel.idFieldPath) || !interfaceModel.idFieldPath.length) ? defaults : interfaceModel.idFieldPath;

        _.each(idFieldPaths, (field: string) => {
            if (!pointer.has(queryDataCline, field)) {
                let err = new Error(`没有找到路径${field}`);
                console.error(err);
                throw err;
            }
            restAngular = restAngular.all(pointer.get(queryDataCline, field));
        });

        console.log(restAngular.getRestangularUrl());

        return restAngular;
    }

    /**
     * 获取接口列表,使用restangular处理接口地址,最后调用接口
     * @param key
     * @param queryData
     * @param $form
     * @returns {IPromise<TResult>}
     */
    doAction(key: string, queryData: Object | restangular.IElement, $form?: ng.IFormController, useType?: string) {
        let queryDataCline, actionModel;

        if (!this.doFormCheck($form)) {
            return;
        }

        return this.getModel(key).then((aModel: IActionModel) => {
            let interfacesRest: { [id: string]: ng.IPromise<any>; } = {};
            let headers = this.restUtils.headers;
            let params = this.restUtils.params;

            actionModel = aModel;
            // 获取接口列表,使用restangular处理接口地址,最后调用接口,返回promise
            _.each(_.filter(actionModel.interfaces, (inte: IInterfaceModel) => {
                if (useType) {
                    return inte.useType == useType;
                }
                return !inte.useType;
            }), (interfaceModel: IInterfaceModel) => {
                // 获取接口的地址
                let promise: ng.IPromise<any>,
                    restAngular = interfaceModel.isRestful
                        ? this.restUtils.getCustomRestful(interfaceModel.address, interfaceModel.port, interfaceModel.path)
                        : this.restUtils.getCustom(interfaceModel.address, interfaceModel.port, interfaceModel.path);

                queryDataCline = _.cloneDeep(queryData);

                // 处理数据
                if (interfaceModel.jpp) {
                    // 数据的删除
                    _.each(interfaceModel.jpp.del, (val) => {
                        pointer.has(queryDataCline, val) && pointer.remove(queryDataCline, val);
                    });
                }

                // 请求加上额外的参数
                interfaceModel.config && restAngular.withHttpConfig(interfaceModel.config);

                headers = _.extend({ 'Action-Key': actionModel.key }, headers);
                // 判断接口请求类型,做提交操作
                switch (interfaceModel.method) {
                    case MethodType.POST:
                        promise = restAngular.post(queryDataCline, null, headers);
                        break;
                    case MethodType.GET:
                        restAngular = this.doGetField(restAngular, queryDataCline, interfaceModel);
                        promise = restAngular.customGET(null, queryDataCline, headers);
                        break;
                    case MethodType.PUT:
                        restAngular = this.doGetField(restAngular, queryDataCline, interfaceModel, ["/id"]);
                        promise = restAngular.customPUT(_.isObject(queryDataCline) ? queryDataCline : null, null, null, headers);
                        break;
                    case MethodType.DELETE:
                        restAngular = this.doGetField(restAngular, queryDataCline, interfaceModel, ["/id"]);
                        promise = restAngular.customDELETE(null, null, headers);
                        break;
                }
                interfacesRest[interfaceModel.key] = promise;
            });

            return interfacesRest;
        }).then((interfacesRest) => {
            // 返回promise
            return this.$q.all(interfacesRest);
        }).then((results: any) => {
            // 设置全局header的值
            this.doDealResult(actionModel, results, this.restUtils.headers, 'header');

            results.actionModel = actionModel;

            return results;
        });
    }
}

mdl.module.provider(Provider._name, [Provider]);