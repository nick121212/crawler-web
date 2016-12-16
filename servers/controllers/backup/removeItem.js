import path from 'path';
import fs from 'fs';
import boom from "boom";
import config from '../../config';

export default () => {
    return async(ctx, next) => {
        let key = ctx.params["key"];

        if (fs.existsSync(path.join(config.db.backup, key))) {
            fs.unlinkSync(path.join(config.db.backup, key));
        } else {
            throw boom.badData(`没有找到文件！`);
        }

        ctx.body = { ret: 0 };
    };
};