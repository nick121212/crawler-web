import _ from "lodash";

export default (config) => {
    return _.extend({}, {
        username: 'root',
        password: '',
        database: 'blessing',
        force: true,
        backup: __dirname + '/../backups',
        options: {
            dialect: 'mysql',
            host: 'localhost',
            port: 3306,
            charset: 'utf8',
            collation: 'utf8_swedish_ci',
            define: {
                timestamps: true,
                freezeTableName: true
            },
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            }
        }
    }, config.db || {});
}