/**
 * 定义爬虫的配置文件
 * @param sequelize
 * @param DataTypes
 * @returns {*|{}|{timestamps, freezeTableName}|Model|void}
 */

import JsonField from 'sequelize-json';

export default (sequelize, DataTypes) => {
    return sequelize.define('action', {
        key: {
            type: DataTypes.STRING(50),
            unique: true
        },
        type: { type: DataTypes.INTEGER, allowNull: false },
        icon: { type: DataTypes.STRING, allowNull: false },
        title: { type: DataTypes.STRING, allowNull: false },
        successMsg: { type: DataTypes.STRING, allowNull: true },
        refreshList: { type: DataTypes.BOOLEAN, allowNull: true },
        closeDialog: { type: DataTypes.BOOLEAN, allowNull: true },
        condition: { type: DataTypes.STRING, allowNull: true },
        path: { type: DataTypes.STRING, allowNull: true },
        itemActions: JsonField(sequelize, 'action', 'itemActions'),
        actions: JsonField(sequelize, 'action', 'actions'),
        confirm: JsonField(sequelize, 'action', 'confirm'),
        form: JsonField(sequelize, 'action', 'form'),
        wizard: JsonField(sequelize, 'action', 'wizard'),
        list: JsonField(sequelize, 'action', 'list'),
        interfaces: JsonField(sequelize, 'action', 'interfaces'),
        group: { type: DataTypes.STRING, allowNull: true }
    }, {
        relations: [{
            type: 'hasMany',
            target: 'perGroupAction',
            as: 'pgActions',
            options: {
                foreignKey: 'actionId',
                constraints: false
            }
        }]
    });
};