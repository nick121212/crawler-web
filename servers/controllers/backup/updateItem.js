import path from 'path';
import fs from 'fs';
import boom from "boom";
import mysqlTools from 'mysql-tools';
import Promise from 'bluebird';
import config from '../../config';

export default () => {
    return async(ctx, next) => {
        let key = ctx.params["key"];

        if (fs.existsSync(path.join(config.db.backup, key))) {
            let tool = new mysqlTools();

            await new Promise(function(resolve, reject) {
                tool.restoreDatabase({
                    host: config.db.options.host,
                    user: config.db.username,
                    password: config.db.password,
                    database: config.db.database,
                    sqlFilePath: path.join(config.db.backup, key)
                }, function(error, output, message) {
                    if (error instanceof Error) {
                        return reject(error);
                    }

                    resolve();
                });
            });
        } else {
            throw boom.badData(`没有找到文件！`);
        }

        ctx.body = { ret: 0 };
    };
};