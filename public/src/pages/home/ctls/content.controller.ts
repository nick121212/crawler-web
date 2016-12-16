/**
 * Created by NICK on 16/8/10.
 */

import * as _ from 'lodash';

export class ContentController {
    public static $inject = ["$rootScope", "$timeout", "materialUtils", "svgUtils", "fxAction", "iconInfoDetailForm"];

    icons: Array<string> = [];
    filter: string;
    text: string;

    constructor(private $rootScope, private $timeout, private materialUtils, private svgUtils, private fxAction, private iconInfoDetailForm) {
        this.icons.length = 0;

        _.each(svgUtils.getAllIcons(), (shape, key) => {
            this.icons.push(key);
        });
    }

    doOpenIconInfo($event, iconInfo: string) {
        this.fxAction.doActionModel($event, this.iconInfoDetailForm, { key: iconInfo });
    }
}

