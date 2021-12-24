module.exports = (sequelize, DataTypes) => {
    const Citizen = sequelize.define("Citizen", {
        id_citizen: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        citizen_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date_of_birth: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        hometown: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tempAddress: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ethnic: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        religion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        level: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        job: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });
    return Citizen;
};