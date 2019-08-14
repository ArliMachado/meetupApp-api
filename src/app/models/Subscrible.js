import Sequelize, { Model } from 'sequelize';

class Subscrible extends Model {
  static init(sequelize) {
    super.init(
      {
        active: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id' });
    this.belongsTo(models.Meetup, { foreignKey: 'meetup_id' });
  }
}

export default Subscrible;
