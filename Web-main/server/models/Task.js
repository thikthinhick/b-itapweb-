module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define("Task", {
        id_task: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        start_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        end_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        is_finished: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        owner_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lower_grade_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    });
    return Task;
};