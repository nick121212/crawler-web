import { module } from '../module';
import * as pointer from 'json-pointer';
import * as _ from 'lodash';

function Provider() {
    /**
     * autocomplete builder函数
     * 初始化参数
     * 初始化搜索功能
     * @param args
     */
    this.builder = function (args) {
        args.form.acOptions = _.extend({
            textField: "",
            keyField: "",
            dataField: "",
            delay: 300,
            noCache: false,
            _where: {},
            search: "",
            actionKey: ""
        }, args.form.acOptions || {});
    };

    this.$get = [function () {
        return {};
    }];
}

module.provider('autoCompleteBuilder', [Provider]);