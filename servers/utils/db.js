import Sequelize from 'sequelize';
import sequelizeImport from 'sequelize-import';
import modelRelation from '../models';
import sequelizeRelationsHelper from 'sequelize-relations-helper';

/**
 * sequelize 操作数据库类
 * 返回sequelize实例，以及所有定义过的model
 */
export class DB {
    constructor() {
        this.sequelize = null;
        this.models = null;
    }

    async execute(config, app) {
        this.Sequelize = Sequelize;
        this.sequelize = new Sequelize(config.database, config.username, config.password, config.options);
        sequelizeRelationsHelper(this.sequelize, { debug: false });
        this.models = await sequelizeImport(__dirname + '/../models', this.sequelize, {
            exclude: ['index.js']
        });

        return this.sequelize.sync({ force: false }).then(() => {
            console.log("db ok!");
        }).catch((err) => {
            console.log(err);
            throw err;
        });
    }
}

export default new DB();