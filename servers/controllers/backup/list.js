import fs from 'fs';
import config from '../../config';

export default () => {
    return async(ctx, next) => {
        if (!fs.existsSync(config.db.backup)) {
            return ctx.body = [];
        }
        ctx.body = await fs.readdirSync(config.db.backup);;
    };
};