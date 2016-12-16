/**
 * 定义爬虫的配置文件
 * @param sequelize
 * @param DataTypes
 * @returns {*|{}|{timestamps, freezeTableName}|Model|void}
 */

import JsonField from 'sequelize-json';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('room', {
        key: {
            type: DataTypes.STRING(50),
            unique: true
        },
        title: { type: DataTypes.STRING(50), allowNull: false },
        position: { type: DataTypes.STRING(100), allowNull: true },
        ips: JsonField(sequelize, 'room', 'ips'),
        description: { type: DataTypes.TEXT, allowNull: true }
    });
};