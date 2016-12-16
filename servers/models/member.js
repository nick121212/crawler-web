const crypto = require("crypto-browserify");

module.exports = (sequelize, DataTypes) => {
    let changePsw = (instance) => {
        let sha1 = crypto.createHash("sha1");
        sha1.update(instance.password);
        instance.password = sha1.digest("hex");
    };

    return sequelize.define('member', {
        username: { type: DataTypes.STRING(45), allowNull: false, unique: true },
        password: { type: DataTypes.STRING(100), allowNull: false },
        name: { type: DataTypes.STRING(10), allowNull: true },
        role: { type: DataTypes.STRING(45), allowNull: true }
    }, {
        hooks: {
            beforeCreate: (instance, options, fn) => {
                changePsw(instance);
                fn();
            },
            beforeUpdate: (instance) => {
                if (!instance.changePsw) {
                    delete instance.password;
                } else {
                    changePsw(instance);
                    delete instance.changePsw;
                }
            }
        }
    });
};