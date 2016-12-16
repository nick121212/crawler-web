import boom from 'boom';
import db from '../../utils/db';

export default (sequelizeModel) => {
    return async(ctx, next) => {
        let key = ctx.params["key"];

        if (!key) {
            throw boom.badData(`id不能为空`);
        }
        let trans = await db.sequelize.transaction();
        let modelIntance = await sequelizeModel.findOne({
            where: {
                key: key
            }
        });
        if (!modelIntance) {
            throw boom.badData(`找不到id:${key}的数据或者已删除!`);
        }

        try {
            await db.sequelize.query('delete from module where lft between $1 and $2;', {
                transaction: trans,
                bind: [modelIntance.lft, modelIntance.rgt]
            });
            await db.sequelize.query('update module set lft=lft-$1 where lft > $2;', {
                transaction: trans,
                bind: [modelIntance.rgt - modelIntance.lft + 1, modelIntance.rgt]
            });
            await db.sequelize.query('update module set rgt=rgt-$1 where rgt > $2;', {
                transaction: trans,
                bind: [modelIntance.rgt - modelIntance.lft + 1, modelIntance.rgt]
            });

            await trans.commit();
        } catch (e) {
            await trans.rollback();

            throw e;
        }

        ctx.body = modelIntance;
    };
};