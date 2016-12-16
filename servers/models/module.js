/**
 * 定义模块表
 * @param sequelize
 * @param DataTypes
 * @returns {*|{}|{timestamps, freezeTableName}|Model|void}
 */
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('module', {
        key: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            unique: true
        },
        title: { type: DataTypes.STRING(20), allowNull: false, unique: true },
        icon: DataTypes.STRING,
        link: DataTypes.STRING,
        lft: DataTypes.INTEGER,
        rgt: DataTypes.INTEGER,
        parentKey: DataTypes.STRING,
        description: { type: DataTypes.TEXT, allowNull: true },
        showed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        relations: [{
            type: 'hasMany',
            target: 'action',
            as: 'actions',
            options: {
                foreignKey: 'group',
                constraints: false
            }
        }]
    });
};