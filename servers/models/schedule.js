/**
 * 定义定时列表
 * @param sequelize
 * @param DataTypes
 * @returns {*|{}|{timestamps, freezeTableName}|Model|void}
 */
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('schedule', {
        key: {
            type: DataTypes.STRING(50),
            unique: true
        },
        title: {type: DataTypes.STRING(20), allowNull: false, unique: true},
        // 爬取的KEY值
        crawlerKey: {type: DataTypes.STRING(50)},
        // 周期
        period: {type: DataTypes.STRING(50)},
        description: {type: DataTypes.TEXT, allowNull: true},
        enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });
};