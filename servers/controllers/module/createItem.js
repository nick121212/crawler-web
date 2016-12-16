import boom from 'boom';
import db from '../../utils/db';
import utils from '../';

export default (sequelizeModel, uniqueFields = []) => {
    /**
     * 创建模块数据
     * 1、验证数据的合法性
     * 2、判断数据库中是否存在【key】的模块,有则报错
     * 3、判断父级模块是否存在,如果存在,而创建的模块又是父级模块,则报错
     * 4、更新数据库中的模块的左右值
     * 5、创建新数据,数据的左值=父级模块的右值,右值=父级模块的右值+2
     */
    return async(ctx, next) => {
        let modelIntance = ctx.request.body;
        let trans = await db.sequelize.transaction();

        if (typeof modelIntance !== "object" || !modelIntance.title || !modelIntance.key) {
            throw boom.badData('数据没有填写完整!');
        }

        utils.checkUniqueFields(sequelizeModel, modelIntance);

        let findModel = await sequelizeModel.count({
            where: {
                key: modelIntance.key
            }
        });

        if (findModel) {
            throw boom.badData(`已经存在【${modelIntance.key}】的模块!`);
        }

        let parentModel = await sequelizeModel.findOne({
                where: {
                    key: modelIntance.parentKey || ""
                }
            }),
            parentCount = await sequelizeModel.count({
                where: {
                    lft: 1
                }
            });

        if (parentCount && !parentModel) {
            throw boom.badData('没有指定父节点!');
        }

        try {
            if (parentModel) {
                await db.sequelize.query('update module set lft=lft+2 where lft > $1;', {
                    transaction: trans,
                    bind: [parentModel.rgt]
                });
                await db.sequelize.query('update module set rgt=rgt+2 where rgt >= $1;', {
                    transaction: trans,
                    bind: [parentModel.rgt]
                });

                modelIntance.lft = parentModel.rgt;
                modelIntance.rgt = parentModel.rgt + 1;
            } else {
                modelIntance.lft = 1;
                modelIntance.rgt = 2;
            }

            console.log(modelIntance);

            let newModel = await sequelizeModel.create(modelIntance, { transaction: trans });

            await trans.commit();

            ctx.body = newModel;
        } catch (err) {
            await trans.rollback();
            throw err;
        }
    };
};