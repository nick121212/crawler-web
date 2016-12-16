/**
 * Created by NICK on 16/8/16.
 * page页面,用户生成列表页和表单操作
 */

import * as ngMaterial from 'angular-material';
import uiRouter from 'angular-ui-router';
import * as ngMaterialIcons from 'angular-material-icons';

import {initRouter} from './router';
import materialServiceMod from '../../services/material.service';
import restRegMod from '../../services/rest.service';
import actionFunc from './services/crawler.value';

const module = angular.module("ttyModule", [ngMaterialIcons, ngMaterial as string, 'ui.router', materialServiceMod, restRegMod]);

module.config([
    "$stateProvider",
    "$urlRouterProvider",
    ($stateProvider, $urlRouterProvider) => {
        // 初始化路由
        initRouter($urlRouterProvider, $stateProvider);
    }]);

actionFunc(module);

export default `${module.name}`;