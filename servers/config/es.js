import _ from "lodash";

export default (config) => {
    return _.extend({}, {
        host: '172.16.140.164',
        port: '9200',
        log: ''
    }, config.es || {});
}