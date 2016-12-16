import boom from 'boom';
import db from '../../utils/db';
import utils from '../../utils';

export default (sequelizeModel) => {
    return async(ctx, next) => {
        let key = ctx.query.key;

        let result = await sequelizeModel.findAndCountAll({
            where: {
                key: key
            },
            include: [{
                model: db.models.pergroupaction,
                attributes: ['id'],
                where: {
                    perGroupId: {
                        $in: ctx.req.__groups__
                    }
                }
            }]
        });

        ctx.body = result;
    };
};