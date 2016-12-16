/**
 * Created by NICK on 16/8/16.
 * page页面,用户生成列表页和表单操作
 */

import * as ngMaterial from 'angular-material';
import uiRouter from 'angular-ui-router';
import * as ngMaterialIcons from 'angular-material-icons';
import { initRouter } from './router';
import materialServiceMod from '../../services/material.service';
import restRegMod from '../../services/rest.service';
import apiValueFunc from './services/salt.api.value';

let module: ng.IModule = angular.module("saltModule", [ngMaterialIcons, ngMaterial as string, 'ui.router', materialServiceMod, restRegMod]);

module.config([
    "$stateProvider",
    "$urlRouterProvider",
    "RestangularProvider",
    ($stateProvider, $urlRouterProvider, RestangularProvider) => {
        // 初始化路由
        initRouter($urlRouterProvider, $stateProvider);
        // 添加全局拦截器拦截器
        RestangularProvider.setDefaultHeaders({
            'Content-Type': 'application/json'
        });
        RestangularProvider.setDefaultHttpFields({
            'withCredentials': true
        });
    }])
    .run(["$rootScope", "$state", "restUtils", "materialUtils", ($rootScope: ng.IRootScopeService, $state, restUtils: fx.utils.restStatic, materialUtils: fx.utils.materialStatic) => {
        // 添加全局拦截器拦截器
        restUtils.setConfig((restAngularConfigure: restangular.IProvider) => {
            restAngularConfigure.addResponseInterceptor((data, operation, what, url, response: restangular.IResponse, deferred) => {
                // 如果是登陆，则监听ws
                if (response.status === 200 && response.config["salt"] && what === "login") {
                    $rootScope.$emit("saltLoginEvent", data);
                }

                return data;
            });
            restAngularConfigure.setErrorInterceptor((response: restangular.IResponse) => {
                if (response.status === 401 && response.config["salt"]) {
                    materialUtils.showErrMsg("SALT未登录");

                    return false;
                }
                return true;
            });
        });
    }]);

apiValueFunc(module);

export default `${module.name}`;