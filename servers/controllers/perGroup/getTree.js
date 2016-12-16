import boom from 'boom';
import db from '../../utils/db';

export default () => {
    return async(ctx, next) => {
        let id = ctx.query.id || 0;

        let results = await db.models['module'].findAll({
            where: {
                showed: true
            },
            include: [{
                model: db.models.action,
                include: [{
                    model: db.models.pergroupaction,
                    attributes: ['id'],
                    on: {
                        actionId: {
                            $col: "actions.id"
                        },
                        perGroupId: id
                    },
                    required: false
                }],
                attributes: ['title', 'id']
            }]
        });

        ctx.body = results;
    };
};