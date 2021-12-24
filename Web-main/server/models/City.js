module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define('City', {
    id_city: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    city_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity_city: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hasAccount: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    canDeclare: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });
  City.associate = (models) => {
    City.hasMany(models.District, {
      onDelete: 'cascade',
      foreignKey: 'id_city',
    });
  };
  return City;
};
