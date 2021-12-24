module.exports = (sequelize, DataTypes) => {
  const District = sequelize.define('District', {
    id_district: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    district_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity_district: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hasAccount: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    id_city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    canDeclare: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });
  District.associate = (models) => {
    District.belongsTo(models.City, {
      onDelete: 'cascade',
      foreignKey: 'id_city',
    });
  };
  District.associate = (models) => {
    District.hasMany(models.Ward, {
      onDelete: 'cascade',
      foreignKey: 'id_district',
    });
  };
  return District;
};
