import boom from 'boom';
import db from '../../utils/db';
import _ from 'lodash';

export default () => {
    return async(ctx, next) => {
        let sql = [];

        let groupIds = await db.models.pergroup.findAll({
            attributes: ["id"],
            where: {
                key: { $in: ctx.req.__role__.groups || [] }
            }
        });

        let results = await db.models.module.findAll({
            attributes: ["key"],
            include: [{
                model: db.models.action,
                attributes: [],
                include: [{
                    model: db.models.pergroupaction,
                    attributes: [],
                    where: {
                        perGroupId: {
                            $in: _.map(groupIds, (item) => { return item.id; })
                        }
                    },
                    required: true
                }]
            }]
        });

        sql.push('select node.*,(count(parent.key)-1) as depth');
        sql.push('  from module as node, module as parent');
        sql.push('  where node.lft between parent.lft and parent.rgt');
        sql.push('  and node.showed=true and node.key in ($1)');
        sql.push('  group by node.key');
        sql.push('  order by node.lft;');

        results = await db.sequelize.query(sql.join(''), {
            bind: [_.map(results, (res) => { return res.key; })]
        });

        ctx.body = results[0];
    };
};