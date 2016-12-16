import _ from "lodash";

export default (config) => {
    return _.extend({}, {
        port: 6379,
        host: '127.0.0.1',
        family: 4,
        password: '',
        db: 0
    }, config.redis || {});
}