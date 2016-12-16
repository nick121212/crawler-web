/**
 * 定义爬虫的配置文件
 * @param sequelize
 * @param DataTypes
 * @returns {*|{}|{timestamps, freezeTableName}|Model|void}
 */

import JsonField from 'sequelize-json';

// models.pergroup.hasMany(models.pergroupaction, {
//         foreignKey: 'group_id',
//         constraints: false,
//         as: 'groupActions'
//     });

export default (sequelize, DataTypes) => {
    return sequelize.define('perGroup', {
        key: {
            type: DataTypes.STRING(50),
            unique: true
        },
        title: { type: DataTypes.STRING(50), allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true }
    }, {
        relations: [
            { type: 'hasMany', target: 'perGroupAction', options: { as: 'groupActions' } }
        ]
    });
};