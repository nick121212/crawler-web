/**
 * Created by NICK on 16/8/12.
 */

import * as _ from "lodash";
import * as ngMaterialIcons from 'angular-material-icons';
import * as ngMaterial from 'angular-material';

class Service {
    public static _name: string = "svgUtils";

    public static provider: Array<string | Function> = ["$q", "$templateRequest", "$templateCache", "ngMdIconService", ($q: ng.IQService, $templateRequest, $templateCache, ngMdIconService: ngMdIcon.service) => {
        class Service {
            /**
             * 获取所有的shapes
             * @returns {any}
             */
            getAllIcons() {
                return ngMdIconService.getShapes();
            }

            /**
             * 载入svg文件
             * @param url
             */
            loadSvgUrl(url: string) {
                let defer = $q.defer();
                let viewBox;

                if ($templateCache.get(url)) {
                    defer.resolve();
                } else {
                    $templateRequest(url, true).then((response)=> {
                        let svg = angular.element('<div>').append(response).find('svg')[0];

                        viewBox = svg.attributes["viewBox"];
                        _.each(svg.querySelectorAll("[id]"), (g)=> {
                            ngMdIconService.addShape(g.id, g.innerHTML);
                            if (viewBox && viewBox.value) {
                                ngMdIconService.addViewBox(g.id, viewBox.value);
                            }
                        });
                        defer.resolve();
                    }, defer.resolve);
                }

                return defer.promise;
            }
        }

        return new Service();
    }];
}

const module = angular.module("mdSvgModule", [ngMaterialIcons, ngMaterial]);

module.service(Service._name, Service.provider);

export default `${module.name}`;