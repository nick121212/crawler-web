/**
 * 定义爬虫的配置文件
 * @param sequelize
 * @param DataTypes
 * @returns {*|{}|{timestamps, freezeTableName}|Model|void}
 */

import JsonField from 'sequelize-json';

export default (sequelize, DataTypes) => {
    return sequelize.define('businessGroup', {
        key: {
            type: DataTypes.STRING(50),
            unique: true
        },
        title: { type: DataTypes.STRING(50), allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true }
    });
};