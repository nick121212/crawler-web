/**
 * Created by NICK on 16/8/9.
 */

import {HomeController} from './ctls/home.controller';
import {SidenavLeftController} from './ctls/sidenavl.controller';
import {SidenavRightController} from './ctls/sidenavr.controller';
import {ContentController} from './ctls/content.controller';

export const initRouter = ($urlRouterProvider, $stateProvider) => {
    // 设置默认路由
    $urlRouterProvider.otherwise(($injector) => {
        let $state = $injector.get("$state");
        $state.go("home");
    });
    // 路由规则
    $stateProvider.state("home", {
        url: "/",
        data: {
            permissions: {
                except: ["anonymous"],
                only: ["user"]
            }
        },
        views: {
            "": {
                controller: HomeController,
                controllerAs: "homeCtl",
                template: require("./tpls/home.template.jade")(),
            },
            "sidenavLeft@home": {
                controller: SidenavLeftController,
                controllerAs: "sideLeftCtl",
                template: require("./tpls/sidenavl.template.jade")(),
            },
            "sidenavRight@home": {
                controller: SidenavRightController,
                controllerAs: "sideRightCtl",
                template: require("./tpls/sidenavr.template.jade")(),
            },
            "content@home": {
                controller: ContentController,
                controllerAs: "contentCtl",
                template: require("./tpls/content.template.jade")(),
            }
        }
    });
};