import { module } from '../module';
import * as pointer from 'json-pointer';
import * as _ from 'lodash';

function Provider() {
    /**
     * layout builder函数
     * 初始化参数
     * 初始化搜索功能
     * @param args
     */
    this.builder = function (args) {
        var layoutDiv = args.fieldFrag.querySelector('[sf-layout]');

        if (layoutDiv && args.form.grid) {
            Object.getOwnPropertyNames(args.form.grid).forEach(function (property, idx, array) {
                layoutDiv.setAttribute(property, args.form.grid[property]);
            });
        };

    };

    this.$get = [function () {
        return {};
    }];
}

module.provider('layoutBuilder', [Provider]);