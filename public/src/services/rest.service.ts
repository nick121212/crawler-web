/**
 * Created by NICK on 16/8/12.
 */

import * as _ from "lodash";
import 'restangular';

class Service {
    public static _name: string = "restUtils";

    public static provider: Array<string | Function> = ["$rootScope", "Restangular", ($rootScope, restangular: restangular.IService) => {
        class Service {

            private rest;
            private restAngularConfig: restangular.IProvider;

            public params: Object;
            public headers: Object;

            constructor(baseUrl: string = "") {
                this.params = {};
                this.headers = {};

                restangular.setBaseUrl(baseUrl);
                this.rest = restangular.withConfig((restAngularConfig: restangular.IProvider) => {
                    this.restAngularConfig = restAngularConfig;
                    // // this.restAngularConfig.setFullResponse(true);
                    // this.restAngularConfig.addResponseInterceptor((data: any, operation: string, what: string, url: string, response: restangular.IResponse, deferred: angular.IDeferred<any>)=> {
                    //     console.log(arguments);
                    //
                    //     return data;
                    // });
                });
            }

            /**
             * 获取不是restful风格的接口信息
             * @param address
             * @param port
             * @param path
             * @param params
             */
            getCustom(address: string, port: number = 0, path: string): restangular.ICollection {
                let baseUrl = "";
                let restangu: restangular.ICollection;

                if (address) {
                    baseUrl = `${address}`;
                }
                if (address && port) {
                    baseUrl += `:${port}`;
                }
                if (!path) {
                    console.error(`path不能为空!`);

                    return null;
                }
                if (baseUrl) {
                    restangu = this.rest.oneUrl("custom", baseUrl);
                } else {
                    restangu = this.rest;
                }

                _.each(path.split("/"), (p) => {
                    restangu = restangu.all(p);
                });

                return restangu;
            }

            getCustomRestful(address: string, port: number = 0, path: string): restangular.ICollection {
                let baseUrl = "";

                if (address) {
                    baseUrl = `${address}`;
                }
                if (address && port) {
                    baseUrl += `:${port}`;
                }

                return this.getRestAngular(path, true, baseUrl);
            }

            /**
             * 设置restangular的参数
             * @param fn  {Function(configurer)}   设置方法
             * @returns {any}
             */
            setConfig(fn: Function) {
                if (_.isFunction(fn)) {
                    return fn(this.restAngularConfig);
                }
            }

            /**
             * 获取一个restangular对象
             * @param router    {String} 路由
             * @param fullRes   {boolean} 是否是fullres
             * @param baseUrl
             * @returns {any}
             */
            getRestAngular(router: string, unique: boolean = true, baseUrl: string = ""): restangular.ICollection {
                let restAngular;
                let restAngularP = unique ? this.rest : restangular;

                if (baseUrl) {
                    restAngular = restAngularP.oneUrl(router, baseUrl);
                }
                restAngular = (restAngular || restAngularP).all(router);

                return restAngular;
            }
        }

        return new Service("");
    }];
}

const module = angular.module("fxRestModule", ["restangular"]);

module.service(Service._name, Service.provider);

export default `${module.name}`;