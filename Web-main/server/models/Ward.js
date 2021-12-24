module.exports = (sequelize, DataTypes) => {
  const Ward = sequelize.define('Ward', {
    id_ward: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    ward_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity_ward: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hasAccount: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    id_district: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    canDeclare: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });
  Ward.associate = (models) => {
    Ward.belongsTo(models.District, {
      onDelete: 'cascade',
      foreignKey: 'id_district',
    });
  };
  Ward.associate = (models) => {
    Ward.hasMany(models.Hamlet, {
      onDelete: 'cascade',
      foreignKey: 'id_ward',
    });
  };
  return Ward;
};
