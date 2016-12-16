import path from 'path';
import _ from "lodash";

export default (config) => {
    return _.extend({}, {
        PORT: 3000,
        backup: path.resolve(__dirname, '../../../uploads/backup'),
        env: process.env.NODE_ENV,
        events: 'http://localhost:3000/events'
    }, config.site || {});
}