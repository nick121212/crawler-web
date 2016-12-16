import boom from 'boom';
import db from '../../utils/db';

export default (sequelizeModel, idField = "id") => {
    return async(ctx, next) => {
        let key = ctx.params["key"];
        let trans = await db.sequelize.transaction();

        if (!key) {
            throw boom.badData(`key不能为空`);
        }

        let modelInstance = await sequelizeModel.findById(key);
        if (!modelInstance) {
            throw boom.badData(`找不到key:${key}的数据或者已删除!`);
        }
        try {
            await db.sequelize.query(`delete from ${db.models.pergroupaction.name} where perGroupId=$1`, {
                transaction: trans,
                bind: [modelInstance.id]
            });

            await modelInstance.destroy({
                transaction: trans
            });
            await trans.commit();
        } catch (e) {
            await trans.rollback();
            throw e;
        }

        ctx.body = {};
    };
};