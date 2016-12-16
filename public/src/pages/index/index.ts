/**
 * Created by NICK on 16/8/10.
 * 链接所有的页面
 */

import 'angular';
import loadingDir from '../../directives/loading';
import './index.scss';
import 'angular-loading-bar';

const module = angular.module("indexApp", ["angular-loading-bar", loadingDir]);

module.config(["cfpLoadingBarProvider", (cfpLoadingBarProvider) => {
    // ng-loading-bar设置
    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.latencyThreshold = 1000;
}]);

$(() => {
    angular.bootstrap(document, [module.name, 'homeModule', 'pageModule', 'passportModule']);
})