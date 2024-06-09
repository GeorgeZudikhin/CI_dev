const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Todo = sequelize.define('todo', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING
        },
        done: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        }
    });
    Todo.associate = models => {
        Todo.belongsTo(models.user);
    };

    return Todo;
};
