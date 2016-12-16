import boom from 'boom';
import db from '../../utils/db';
import utils from '../../utils';

export default (sequelizeModel) => {
    return async(ctx, next) => {
        let filter = utils.query(ctx.query);
        let result = await sequelizeModel.findAndCountAll(filter);

        ctx.body = result;
    };
};